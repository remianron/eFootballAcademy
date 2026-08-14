import { prisma } from "@/lib/db/client";
import { Prisma, type PublishStatus } from "@/generated/prisma/client";
import type { DiscoveryEditorInput } from "@/lib/discovery-editor/types";
import {
  hasDiscoveryErrors,
  validateDiscoveryEditorInput,
} from "@/lib/discovery-editor/validation";
import {
  normalizeContentMedia,
  type NormalizedContentMedia,
} from "@/lib/content-editor/media-input";
import { normalizeContentBlocks } from "@/lib/content-blocks/validation";
import type { NormalizedContentBlock } from "@/lib/content-blocks/types";
import { syncContentBlocks } from "@/lib/db/repositories/content-blocks.repo";
import { EditorFieldError } from "@/lib/content-editor/errors";

export type SaveDiscoveryResult =
  | {
      ok: true;
      discovery: { id: string; slug: string; status: PublishStatus };
    }
  | { ok: false; errors: Record<string, string> };

type Tx = Prisma.TransactionClient;

type NormalizedDiscovery = {
  title: string;
  slug: string;
  category: DiscoveryEditorInput["category"];
  excerpt: string;
  content: string;
  findings: string[];
  author: string;
  sources: string[];
  researchStatus: DiscoveryEditorInput["researchStatus"];
  media: NormalizedContentMedia[];
  blocks: NormalizedContentBlock[];
  status: PublishStatus;
};

function normalizeDiscovery(input: DiscoveryEditorInput): NormalizedDiscovery {
  const trim = (value: string) => value.trim();
  return {
    title: trim(input.title),
    slug: trim(input.slug),
    category: input.category,
    excerpt: trim(input.excerpt),
    content: trim(input.content),
    findings: input.findings.map(trim),
    author: trim(input.author),
    sources: input.sources.map(trim),
    researchStatus: input.researchStatus,
    media: normalizeContentMedia(input.media),
    blocks: normalizeContentBlocks(input.blocks),
    status: input.status,
  };
}

async function syncMedia(
  tx: Tx,
  discoveryId: string,
  media: NormalizedContentMedia[]
): Promise<void> {
  await tx.media.deleteMany({
    where: { ownerType: "DISCOVERY", ownerId: discoveryId },
  });
  if (media.length > 0) {
    await tx.media.createMany({
      data: media.map((item, index) => ({
        ownerType: "DISCOVERY",
        ownerId: discoveryId,
        kind: item.kind,
        youtubeVideoId: item.youtubeVideoId,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        alt: item.alt || null,
        caption: item.caption || null,
        aspectRatio: item.aspectRatio,
        isPrimary: false,
        order: index + 1,
      })),
    });
  }
}

async function saveInTransaction(
  tx: Tx,
  data: NormalizedDiscovery,
  discoveryId: string | undefined
): Promise<{ ok: true; discovery: { id: string; slug: string; status: PublishStatus } }> {
  const existing = discoveryId
    ? await tx.discovery.findUnique({ where: { id: discoveryId } })
    : null;
  if (discoveryId && !existing) {
    throw new EditorFieldError({ _form: "Discovery not found." });
  }
  const duplicate = await tx.discovery.findFirst({
    where: { slug: data.slug, ...(discoveryId ? { id: { not: discoveryId } } : {}) },
  });
  if (duplicate) {
    throw new EditorFieldError({
      slug: "This slug is already used by another discovery.",
    });
  }

  const fields = {
    title: data.title,
    slug: data.slug,
    category: data.category,
    excerpt: data.excerpt,
    content: data.content,
    findings: data.findings.length > 0 ? data.findings : Prisma.DbNull,
    author: data.author,
    sources: data.sources,
    researchStatus: data.researchStatus,
    status: data.status,
  };

  const discovery = existing
    ? await tx.discovery.update({
        where: { id: existing.id },
        data: {
          ...fields,
          publishedAt:
            existing.publishedAt ??
            (data.status === "PUBLISHED" ? new Date() : null),
        },
      })
    : await tx.discovery.create({
        data: {
          ...fields,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        },
      });

  await syncMedia(tx, discovery.id, data.media);
  await syncContentBlocks(tx, "DISCOVERY", discovery.id, data.blocks);

  return {
    ok: true,
    discovery: {
      id: discovery.id,
      slug: discovery.slug,
      status: discovery.status,
    },
  };
}

export async function saveDiscovery(
  input: DiscoveryEditorInput,
  opts: { discoveryId?: string } = {}
): Promise<SaveDiscoveryResult> {
  const errors = validateDiscoveryEditorInput(input, {
    requirePublishable: input.status === "PUBLISHED",
  });
  if (hasDiscoveryErrors(errors)) return { ok: false, errors };
  const data = normalizeDiscovery(input);
  try {
    return await prisma.$transaction((tx) =>
      saveInTransaction(tx, data, opts.discoveryId)
    );
  } catch (error) {
    if (error instanceof EditorFieldError) {
      return { ok: false, errors: error.errors };
    }
    throw error;
  }
}

export async function setDiscoveryStatus(
  discoveryId: string,
  status: PublishStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.discovery.findUnique({
    where: { id: discoveryId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Discovery not found." };
  await prisma.discovery.update({
    where: { id: discoveryId },
    data: { status },
  });
  return { ok: true };
}

export async function deleteDraftDiscovery(
  discoveryId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.discovery.findUnique({
    where: { id: discoveryId },
    select: { status: true },
  });
  if (!existing) return { ok: false, error: "Discovery not found." };
  if (existing.status !== "DRAFT") {
    return { ok: false, error: "Only drafts can be deleted." };
  }
  await prisma.$transaction([
    prisma.media.deleteMany({
      where: { ownerType: "DISCOVERY", ownerId: discoveryId },
    }),
    prisma.contentBlock.deleteMany({
      where: { ownerType: "DISCOVERY", ownerId: discoveryId },
    }),
    prisma.discovery.delete({ where: { id: discoveryId } }),
  ]);
  return { ok: true };
}