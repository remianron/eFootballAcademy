import { prisma } from "@/lib/db/client";
import { extractYouTubeVideoId } from "@/lib/build-editor/youtube";
import { slugify } from "@/lib/build-editor/slug";
import {
  hasEditorErrors,
  isMediaItemEmpty,
  validateBuildEditorInput,
  type EditorErrors,
} from "@/lib/build-editor/validation";
import type { BuildEditorInput } from "@/lib/build-editor/types";
import { normalizeContentBlocks } from "@/lib/content-blocks/validation";
import type { NormalizedContentBlock } from "@/lib/content-blocks/types";
import { syncContentBlocks } from "@/lib/db/repositories/content-blocks.repo";
import type {
  MediaKind,
  Prisma,
  PublishStatus,
} from "@/generated/prisma/client";

export type SaveBuildResult =
  | {
      ok: true;
      build: { id: string; slug: string; status: PublishStatus };
    }
  | { ok: false; errors: EditorErrors };

type Tx = Prisma.TransactionClient;

class EditorFieldError extends Error {
  constructor(readonly errors: EditorErrors) {
    super("Editor validation failed");
  }
}

type NormalizedMediaItem = {
  kind: MediaKind;
  youtubeVideoId: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  alt: string;
  caption: string;
  aspectRatio: string;
};

type NormalizedBuildInput = {
  playerName: string;
  playerSlug: string;
  cardName: string;
  rarity: string | null;
  position: string;
  overall: number;
  buildName: string;
  buildSlug: string;
  playstyle: string | null;
  shortDescription: string;
  philosophy: string;
  skills: string[];
  recommendedFor: string[];
  avoidFor: string[];
  statistics: Record<string, number | null>;
  keyAttributes: string[];
  strengths: string[];
  weaknesses: string[];
  screenshot: { url: string; alt: string; caption: string };
  media: NormalizedMediaItem[];
  blocks: NormalizedContentBlock[];
  status: PublishStatus;
};

function normalizeInput(input: BuildEditorInput): NormalizedBuildInput {
  const trim = (value: string) => value.trim();
  const statistics: Record<string, number | null> = {};
  for (const [key, value] of Object.entries(input.statistics)) {
    statistics[key] = value.trim() === "" ? null : Number(value);
  }
  const media = input.media
    .filter((item) => !isMediaItemEmpty(item))
    .map((item): NormalizedMediaItem => {
      if (item.kind === "YOUTUBE_VIDEO") {
        return {
          kind: item.kind,
          youtubeVideoId: extractYouTubeVideoId(item.youtubeInput),
          url: null,
          thumbnailUrl: item.thumbnailUrl.trim() || null,
          alt: trim(item.alt),
          caption: trim(item.caption),
          aspectRatio: item.aspectRatio,
        };
      }
      return {
        kind: item.kind,
        youtubeVideoId: null,
        url: item.url.trim() || null,
        thumbnailUrl: item.thumbnailUrl.trim() || null,
        alt: trim(item.alt),
        caption: trim(item.caption),
        aspectRatio: item.aspectRatio,
      };
    });
  return {
    playerName: trim(input.playerName),
    playerSlug: trim(input.playerSlug),
    cardName: trim(input.cardName),
    rarity: trim(input.rarity) || null,
    position: trim(input.position),
    overall: Number(input.overall),
    buildName: trim(input.buildName),
    buildSlug: trim(input.buildSlug),
    playstyle: trim(input.playstyle) || null,
    shortDescription: trim(input.shortDescription),
    philosophy: trim(input.philosophy),
    skills: input.skills.map(trim),
    recommendedFor: input.recommendedFor.map(trim),
    avoidFor: input.avoidFor.map(trim),
    statistics,
    keyAttributes: input.keyAttributes,
    strengths: input.strengths.map(trim),
    weaknesses: input.weaknesses.map(trim),
    screenshot: {
      url: trim(input.screenshot.url),
      alt: trim(input.screenshot.alt),
      caption: trim(input.screenshot.caption),
    },
    media,
    blocks: normalizeContentBlocks(input.blocks),
    status: input.status,
  };
}

async function syncOrderedItems(
  tx: Tx,
  table: "buildStrength" | "buildWeakness",
  buildId: string,
  items: string[]
) {
  const trimmed = items.map((item) => item.trim()).filter(Boolean);
  if (table === "buildStrength") {
    await tx.buildStrength.deleteMany({ where: { buildId } });
    if (trimmed.length > 0) {
      await tx.buildStrength.createMany({
        data: trimmed.map((text, index) => ({
          buildId,
          text,
          order: index + 1,
        })),
      });
    }
  } else {
    await tx.buildWeakness.deleteMany({ where: { buildId } });
    if (trimmed.length > 0) {
      await tx.buildWeakness.createMany({
        data: trimmed.map((text, index) => ({
          buildId,
          text,
          order: index + 1,
        })),
      });
    }
  }
}

async function syncStatistics(
  tx: Tx,
  data: NormalizedBuildInput,
  buildId: string
) {
  const populated = Object.entries(data.statistics).filter(
    (entry): entry is [string, number] => entry[1] !== null
  );
  if (populated.length === 0) {
    await tx.buildStatistic.deleteMany({ where: { buildId } });
    return;
  }
  const keys = populated.map(([key]) => key);
  const attributes = await tx.attribute.findMany({
    where: { key: { in: keys } },
    select: { id: true, key: true },
  });
  const idByKey = new Map(attributes.map((attribute) => [attribute.key, attribute.id]));
  const missing = keys.filter((key) => !idByKey.has(key));
  if (missing.length > 0) {
    throw new EditorFieldError({
      _form: `Unknown attribute keys: ${missing.join(", ")}`,
    });
  }
  await tx.buildStatistic.deleteMany({
    where: { buildId, attributeId: { notIn: attributes.map((a) => a.id) } },
  });
  const orderByKey: Record<string, number> = {};
  data.keyAttributes.forEach((key, index) => {
    orderByKey[key] = index + 1;
  });
  for (const [key, value] of populated) {
    const attributeId = idByKey.get(key);
    if (!attributeId) continue;
    const order = orderByKey[key] ?? null;
    await tx.buildStatistic.upsert({
      where: { buildId_attributeId: { buildId, attributeId } },
      update: { value, isKey: order !== null, keyOrder: order },
      create: { buildId, attributeId, value, isKey: order !== null, keyOrder: order },
    });
  }
}

async function syncMedia(tx: Tx, buildId: string, data: NormalizedBuildInput) {
  await tx.media.deleteMany({ where: { ownerType: "BUILD", ownerId: buildId } });
  const rows: Prisma.MediaCreateManyInput[] = [];
  if (data.screenshot.url) {
    rows.push({
      ownerType: "BUILD",
      ownerId: buildId,
      kind: "IMAGE",
      youtubeVideoId: null,
      url: data.screenshot.url,
      thumbnailUrl: null,
      alt: data.screenshot.alt || null,
      caption: data.screenshot.caption || null,
      aspectRatio: "16:9",
      isPrimary: true,
      order: 0,
    });
  }
  data.media.forEach((item, index) => {
    rows.push({
      ownerType: "BUILD",
      ownerId: buildId,
      kind: item.kind,
      youtubeVideoId: item.youtubeVideoId,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      alt: item.alt || null,
      caption: item.caption || null,
      aspectRatio: item.aspectRatio,
      isPrimary: false,
      order: index + 1,
    });
  });
  if (rows.length > 0) {
    await tx.media.createMany({ data: rows });
  }
}

async function uniqueCardSlug(
  tx: Tx,
  cardName: string,
  playerSlug: string
): Promise<string> {
  const base = slugify(cardName) || `${slugify(playerSlug) || "player"}-card`;
  let candidate = base;
  let suffix = 2;
  while (await tx.playerCard.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

async function saveInTransaction(
  tx: Tx,
  data: NormalizedBuildInput,
  buildId: string | undefined
): Promise<{ ok: true; build: { id: string; slug: string; status: PublishStatus } }> {
  const ownedPlayerId = buildId
    ? (
        await tx.build.findUnique({
          where: { id: buildId },
          select: { card: { select: { playerId: true } } },
        })
      )?.card.playerId ?? null
    : null;
  if (buildId && ownedPlayerId === null) {
    throw new EditorFieldError({ _form: "Build not found." });
  }

  let player = await tx.player.findUnique({
    where: { slug: data.playerSlug },
  });
  if (player) {
    const ownsBuild = ownedPlayerId !== null && ownedPlayerId === player.id;
    if (!ownsBuild && player.name !== data.playerName) {
      throw new EditorFieldError({
        playerSlug: `This slug already belongs to another player (${player.name}).`,
      });
    }
    if (player.name !== data.playerName) {
      player = await tx.player.update({
        where: { id: player.id },
        data: { name: data.playerName },
      });
    }
  } else {
    player = await tx.player.create({
      data: { slug: data.playerSlug, name: data.playerName },
    });
  }

  let card = await tx.playerCard.findUnique({
    where: {
      playerId_cardName: { playerId: player.id, cardName: data.cardName },
    },
  });
  if (card) {
    card = await tx.playerCard.update({
      where: { id: card.id },
      data: {
        position: data.position,
        overall: data.overall,
        rarity: data.rarity,
      },
    });
  } else {
    const slug = await uniqueCardSlug(tx, data.cardName, data.playerSlug);
    card = await tx.playerCard.create({
      data: {
        playerId: player.id,
        slug,
        cardName: data.cardName,
        position: data.position,
        overall: data.overall,
        rarity: data.rarity,
      },
    });
  }

  const buildData = {
    slug: data.buildSlug,
    buildName: data.buildName,
    shortDescription: data.shortDescription,
    philosophy: data.philosophy,
    playstyle: data.playstyle,
    skills: data.skills,
    recommendedFor: data.recommendedFor,
    avoidFor: data.avoidFor,
    status: data.status,
    cardId: card.id,
  } satisfies Prisma.BuildUncheckedCreateInput;

  let build: { id: string; slug: string; status: PublishStatus };
  if (buildId) {
    const existing = await tx.build.findUnique({ where: { id: buildId } });
    if (!existing) {
      throw new EditorFieldError({ _form: "Build not found." });
    }
    const duplicate = await tx.build.findFirst({
      where: { slug: data.buildSlug, id: { not: buildId } },
    });
    if (duplicate) {
      throw new EditorFieldError({
        buildSlug: "This slug is already used by another build.",
      });
    }
    const publishedAt =
      existing.publishedAt ??
      (data.status === "PUBLISHED" ? new Date() : null);
    build = await tx.build.update({
      where: { id: buildId },
      data: { ...buildData, publishedAt },
    });
  } else {
    const duplicate = await tx.build.findUnique({
      where: { slug: data.buildSlug },
    });
    if (duplicate) {
      throw new EditorFieldError({
        buildSlug: "This slug is already used by another build.",
      });
    }
    build = await tx.build.create({
      data: {
        ...buildData,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });
  }

  await syncStatistics(tx, data, build.id);
  await syncOrderedItems(tx, "buildStrength", build.id, data.strengths);
  await syncOrderedItems(tx, "buildWeakness", build.id, data.weaknesses);
  await syncMedia(tx, build.id, data);
  await syncContentBlocks(tx, "BUILD", build.id, data.blocks);

  return { ok: true, build };
}

export async function saveBuild(
  input: BuildEditorInput,
  opts: { buildId?: string } = {}
): Promise<SaveBuildResult> {
  const errors = validateBuildEditorInput(input, {
    requirePublishable: input.status === "PUBLISHED",
  });
  if (hasEditorErrors(errors)) return { ok: false, errors };
  const data = normalizeInput(input);
  try {
    return await prisma.$transaction((tx) =>
      saveInTransaction(tx, data, opts.buildId)
    );
  } catch (error) {
    if (error instanceof EditorFieldError) {
      return { ok: false, errors: error.errors };
    }
    throw error;
  }
}

export async function setBuildStatus(
  buildId: string,
  status: PublishStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.build.findUnique({
    where: { id: buildId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Build not found." };
  await prisma.build.update({ where: { id: buildId }, data: { status } });
  return { ok: true };
}

export async function deleteDraftBuild(
  buildId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.build.findUnique({
    where: { id: buildId },
    select: { status: true },
  });
  if (!existing) return { ok: false, error: "Build not found." };
  if (existing.status !== "DRAFT") {
    return { ok: false, error: "Only drafts can be deleted." };
  }
  await prisma.$transaction([
    prisma.media.deleteMany({
      where: { ownerType: "BUILD", ownerId: buildId },
    }),
    prisma.contentBlock.deleteMany({
      where: { ownerType: "BUILD", ownerId: buildId },
    }),
    prisma.build.delete({ where: { id: buildId } }),
  ]);
  return { ok: true };
}