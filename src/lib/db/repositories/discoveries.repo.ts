import { prisma } from "@/lib/db/client";
import type { ContentBlockDto, DiscoveryDto, MediaDto } from "@/lib/db/types";
import { listFromJson, listFromJsonNullable } from "@/lib/db/types";
import { contentBlocksForOwner } from "@/lib/db/repositories/content-blocks.repo";

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

function toDiscovery(
  row: {
    id: string;
    slug: string;
    title: string;
    category: DiscoveryDto["category"];
    excerpt: string;
    content: string;
    findings: unknown;
    author: string;
    sources: unknown;
    researchStatus: DiscoveryDto["researchStatus"];
    status: DiscoveryDto["status"];
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  media: MediaDto[],
  blocks: ContentBlockDto[]
): DiscoveryDto {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    findings: listFromJsonNullable(row.findings),
    author: row.author,
    sources: listFromJson(row.sources),
    researchStatus: row.researchStatus,
    status: row.status,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    media,
    blocks,
  };
}

export interface DiscoveryCardRowDto {
  id: string;
  slug: string;
  title: string;
  category: DiscoveryDto["category"];
  excerpt: string;
  author: string;
  researchStatus: DiscoveryDto["researchStatus"];
  status: DiscoveryDto["status"];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export async function listPublishedDiscoveriesForPublic(): Promise<DiscoveryCardRowDto[]> {
  const rows = await prisma.discovery.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      excerpt: true,
      author: true,
      researchStatus: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    author: row.author,
    researchStatus: row.researchStatus,
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export interface DiscoveryOverviewRow {
  id: string;
  slug: string;
  title: string;
  category: DiscoveryDto["category"];
  researchStatus: DiscoveryDto["researchStatus"];
  status: DiscoveryDto["status"];
  updatedAt: string;
}

export async function getDiscoveryById(id: string): Promise<DiscoveryDto | null> {
  const row = await prisma.discovery.findUnique({ where: { id } });
  if (!row) return null;
  const [media, blocks] = await Promise.all([
    mediaForDiscoveries([row.id]),
    contentBlocksForOwner("DISCOVERY", [row.id]),
  ]);
  return toDiscovery(row, media.get(row.id) ?? [], blocks.get(row.id) ?? []);
}

export async function listDiscoveriesOverview(): Promise<DiscoveryOverviewRow[]> {
  const rows = await prisma.discovery.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      researchStatus: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    ...row,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

async function mediaForDiscoveries(
  discoveryIds: string[]
): Promise<Map<string, MediaDto[]>> {
  const rows = await prisma.media.findMany({
    where: { ownerType: "DISCOVERY", ownerId: { in: discoveryIds } },
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

export async function listDiscoveries(publishOnly = false): Promise<DiscoveryDto[]> {
  const rows = await prisma.discovery.findMany({
    where: publishOnly ? { status: "PUBLISHED" } : undefined,
    orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });
  const [media, blocks] = await Promise.all([
    mediaForDiscoveries(rows.map((row) => row.id)),
    contentBlocksForOwner("DISCOVERY", rows.map((row) => row.id)),
  ]);
  return rows.map((row) =>
    toDiscovery(row, media.get(row.id) ?? [], blocks.get(row.id) ?? [])
  );
}

export async function getDiscoveryBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean; publishOnly?: boolean } = {}
): Promise<DiscoveryDto | null> {
  const row = await prisma.discovery.findUnique({
    where: { slug },
  });
  if (!row) return null;
  if (opts.includeUnpublished && row.status !== "PUBLISHED") return null;
  if (opts.publishOnly && row.status !== "PUBLISHED") return null;
  const [media, blocks] = await Promise.all([
    mediaForDiscoveries([row.id]),
    contentBlocksForOwner("DISCOVERY", [row.id]),
  ]);
  return toDiscovery(row, media.get(row.id) ?? [], blocks.get(row.id) ?? []);
}