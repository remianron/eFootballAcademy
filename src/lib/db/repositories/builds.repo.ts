import { prisma } from "@/lib/db/client";
import type {
  BuildDetailDto,
  BuildSummaryDto,
  FeedbackEntryDto,
  MediaDto,
  StatisticEntryDto,
} from "@/lib/db/types";
import { listFromJson } from "@/lib/db/types";
import type { Prisma, PublishStatus } from "@/generated/prisma/client";

export const buildInclude = {
  card: {
    include: {
      player: true,
      builds: {
        select: { id: true, slug: true, buildName: true, status: true },
        orderBy: { createdAt: "asc" },
      },
    },
  },
  statistics: {
    include: { attribute: true },
    orderBy: { attribute: { sortIndex: "asc" } },
  },
  strengths: { orderBy: { order: "asc" } },
  weaknesses: { orderBy: { order: "asc" } },
  feedback: { orderBy: { date: "desc" } },
} satisfies Prisma.BuildInclude;

export type BuildRow = Prisma.BuildGetPayload<{ include: typeof buildInclude }>;

function toStatistic(row: {
  attribute: { key: string; name: string; category: StatisticEntryDto["category"] };
  value: number;
  isKey: boolean;
  keyOrder: number | null;
}): StatisticEntryDto {
  return {
    attributeKey: row.attribute.key,
    attributeName: row.attribute.name,
    category: row.attribute.category,
    value: row.value,
    isKey: row.isKey,
    keyOrder: row.keyOrder,
  };
}

function toFeedback(
  row: {
    platform: FeedbackEntryDto["platform"];
    author: string;
    comment: string;
    profileUrl: string | null;
    avatarUrl: string | null;
    date: Date | null;
    verified: boolean;
  }
): FeedbackEntryDto {
  return {
    platform: row.platform,
    author: row.author,
    comment: row.comment,
    profileUrl: row.profileUrl,
    avatarUrl: row.avatarUrl,
    date: row.date,
    verified: row.verified,
  };
}

function toMedia(row: {
  id: string;
  ownerType: MediaDto["ownerType"];
  ownerId: string;
  kind: MediaDto["kind"];
  youtubeVideoId: string | null;
  aspectRatio: string;
  thumbnailUrl: string | null;
  url: string | null;
  alt: string | null;
  caption: string | null;
  isPrimary: boolean;
  order: number;
}): MediaDto {
  return {
    id: row.id,
    ownerType: row.ownerType,
    ownerId: row.ownerId,
    kind: row.kind,
    youtubeVideoId: row.youtubeVideoId,
    aspectRatio: row.aspectRatio,
    thumbnailUrl: row.thumbnailUrl,
    url: row.url,
    alt: row.alt,
    caption: row.caption,
    isPrimary: row.isPrimary,
    order: row.order,
  };
}

function toBuildDetail(row: BuildRow, media: MediaDto[]): BuildDetailDto {
  const statistics = row.statistics.map(toStatistic);
  const keyAttributes = statistics
    .filter((stat) => stat.isKey)
    .sort((a, b) => (a.keyOrder ?? 0) - (b.keyOrder ?? 0));
  const variantBuilds: BuildSummaryDto[] = row.card.builds.map((build) => ({
    id: build.id,
    slug: build.slug,
    buildName: build.buildName,
    status: build.status,
  }));
  return {
    id: row.id,
    slug: row.slug,
    buildName: row.buildName,
    shortDescription: row.shortDescription,
    philosophy: row.philosophy,
    playstyle: row.playstyle,
    skills: listFromJson(row.skills),
    recommendedFor: listFromJson(row.recommendedFor),
    avoidFor: listFromJson(row.avoidFor),
    status: row.status,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    card: {
      id: row.card.id,
      slug: row.card.slug,
      cardName: row.card.cardName,
      rarity: row.card.rarity,
      position: row.card.position,
      overall: row.card.overall,
      player: {
        id: row.card.player.id,
        slug: row.card.player.slug,
        name: row.card.player.name,
      },
      variantBuilds,
    },
    statistics,
    keyAttributes,
    strengths: row.strengths.map((strength) => strength.text),
    weaknesses: row.weaknesses.map((weakness) => weakness.text),
    feedback: row.feedback.map(toFeedback),
    media,
  };
}

async function mediaForBuilds(buildIds: string[]): Promise<Map<string, MediaDto[]>> {
  const rows = await prisma.media.findMany({
    where: { ownerType: "BUILD", ownerId: { in: buildIds } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const grouped = new Map<string, MediaDto[]>();
  for (const row of rows) {
    const list = grouped.get(row.ownerId) ?? [];
    list.push(toMedia(row));
    grouped.set(row.ownerId, list);
  }
  return grouped;
}

export async function listBuilds(publishOnly = false): Promise<BuildDetailDto[]> {
  const rows = await prisma.build.findMany({
    where: publishOnly ? { status: "PUBLISHED" } : undefined,
    include: buildInclude,
    orderBy: { createdAt: "desc" },
  });
  const media = await mediaForBuilds(rows.map((row) => row.id));
  return rows.map((row) =>
    toBuildDetail(row, media.get(row.id) ?? [])
  );
}

export async function getBuildBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean; publishOnly?: boolean } = {}
): Promise<BuildDetailDto | null> {
  const row = await prisma.build.findUnique({
    where: { slug },
    include: buildInclude,
  });
  if (!row) return null;
  if (opts.includeUnpublished && row.status !== "PUBLISHED") return null;
  if (opts.publishOnly && row.status !== "PUBLISHED") return null;
  const media = await mediaForBuilds([row.id]);
  return toBuildDetail(row, media.get(row.id) ?? []);
}

export async function listBuildsForCard(
  cardSlug: string,
  publishOnly = false
): Promise<BuildDetailDto[]> {
  const cards = await prisma.playerCard.findUnique({
    where: { slug: cardSlug },
    select: { id: true },
  });
  if (!cards) return [];
  const rows = await prisma.build.findMany({
    where: { cardId: cards.id, ...(publishOnly ? { status: "PUBLISHED" } : {}) },
    include: buildInclude,
    orderBy: { createdAt: "asc" },
  });
  const media = await mediaForBuilds(rows.map((row) => row.id));
  return rows.map((row) => toBuildDetail(row, media.get(row.id) ?? []));
}

export async function getBuildById(id: string): Promise<BuildDetailDto | null> {
  const row = await prisma.build.findUnique({
    where: { id },
    include: buildInclude,
  });
  if (!row) return null;
  const media = await mediaForBuilds([row.id]);
  return toBuildDetail(row, media.get(row.id) ?? []);
}

export interface BuildCardRowDto {
  id: string;
  slug: string;
  buildName: string;
  shortDescription: string;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
  playerName: string;
  cardName: string;
  position: string;
  overall: number;
}

export async function listPublishedBuildsForPublic(): Promise<BuildCardRowDto[]> {
  const rows = await prisma.build.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      buildName: true,
      shortDescription: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      card: {
        select: {
          position: true,
          overall: true,
          cardName: true,
          player: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    buildName: row.buildName,
    shortDescription: row.shortDescription,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    playerName: row.card.player.name,
    cardName: row.card.cardName,
    position: row.card.position,
    overall: row.card.overall,
  }));
}

export async function listPublishedVariantsForCard(
  playerName: string,
  cardName: string
): Promise<BuildCardRowDto[]> {
  const cards = await prisma.playerCard.findMany({
    where: { cardName, player: { name: playerName } },
    select: { id: true },
  });
  if (cards.length === 0) return [];
  const rows = await prisma.build.findMany({
    where: {
      cardId: { in: cards.map((card) => card.id) },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      slug: true,
      buildName: true,
      shortDescription: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      card: {
        select: {
          position: true,
          overall: true,
          cardName: true,
          player: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    buildName: row.buildName,
    shortDescription: row.shortDescription,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    playerName: row.card.player.name,
    cardName: row.card.cardName,
    position: row.card.position,
    overall: row.card.overall,
  }));
}

export interface BuildOverviewRow {
  id: string;
  slug: string;
  buildName: string;
  status: PublishStatus;
  position: string;
  overall: number;
  cardName: string;
  playerName: string;
  updatedAt: string;
}

export async function listBuildsOverview(): Promise<BuildOverviewRow[]> {
  const rows = await prisma.build.findMany({
    select: {
      id: true,
      slug: true,
      buildName: true,
      status: true,
      updatedAt: true,
      card: {
        select: {
          position: true,
          overall: true,
          cardName: true,
          player: { select: { name: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    buildName: row.buildName,
    status: row.status,
    position: row.card.position,
    overall: row.card.overall,
    cardName: row.card.cardName,
    playerName: row.card.player.name,
    updatedAt: row.updatedAt.toISOString(),
  }));
}