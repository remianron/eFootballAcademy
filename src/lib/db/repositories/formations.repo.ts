import { prisma } from "@/lib/db/client";
import type { ContentBlockDto, FormationDto, FormationRoleDto, MediaDto } from "@/lib/db/types";
import { listFromJson } from "@/lib/db/types";
import { contentBlocksForOwner } from "@/lib/db/repositories/content-blocks.repo";
import type { Prisma } from "@/generated/prisma/client";

function toRole(row: { position: string; description: string; order: number }): FormationRoleDto {
  return { position: row.position, description: row.description, order: row.order };
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

const formationInclude = {
  roles: { orderBy: { order: "asc" } },
} as const;

export type FormationIncludeRow = Prisma.FormationGuideGetPayload<{
  include: typeof formationInclude;
}>;

export interface FormationCardRowDto {
  id: string;
  slug: string;
  title: string;
  formation: string;
  playstyle: string;
  description: string;
  status: FormationDto["status"];
  createdAt: string;
  updatedAt: string;
}

export async function listPublishedFormationsForPublic(): Promise<FormationCardRowDto[]> {
  const rows = await prisma.formationGuide.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      formation: true,
      playstyle: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export interface FormationOverviewRow {
  id: string;
  slug: string;
  title: string;
  formation: string;
  playstyle: string;
  status: FormationDto["status"];
  updatedAt: string;
}

export async function getFormationById(id: string): Promise<FormationDto | null> {
  const row = await prisma.formationGuide.findUnique({
    where: { id },
    include: formationInclude,
  });
  if (!row) return null;
  const [media, blocks] = await Promise.all([
    mediaForFormations([row.id]),
    contentBlocksForOwner("FORMATION_GUIDE", [row.id]),
  ]);
  return toFormation(row, media.get(row.id) ?? [], blocks.get(row.id) ?? []);
}

export async function listFormationsOverview(): Promise<FormationOverviewRow[]> {
  const rows = await prisma.formationGuide.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      formation: true,
      playstyle: true,
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

function toFormation(
  row: {
    id: string;
    slug: string;
    title: string;
    formation: string;
    playstyle: string;
    description: string;
    recommendedUsage: string;
    tacticalInstructions: unknown;
    strengths: unknown;
    weaknesses: unknown;
    roles: { position: string; description: string; order: number }[];
    status: FormationDto["status"];
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  media: MediaDto[],
  blocks: ContentBlockDto[]
): FormationDto {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    formation: row.formation,
    playstyle: row.playstyle,
    description: row.description,
    recommendedUsage: row.recommendedUsage,
    tacticalInstructions: listFromJson(row.tacticalInstructions),
    strengths: listFromJson(row.strengths),
    weaknesses: listFromJson(row.weaknesses),
    roles: row.roles.map(toRole),
    status: row.status,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    media,
    blocks,
  };
}

async function mediaForFormations(
  formationIds: string[]
): Promise<Map<string, MediaDto[]>> {
  const rows = await prisma.media.findMany({
    where: { ownerType: "FORMATION_GUIDE", ownerId: { in: formationIds } },
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

export async function listFormations(publishOnly = false): Promise<FormationDto[]> {
  const rows = await prisma.formationGuide.findMany({
    where: publishOnly ? { status: "PUBLISHED" } : undefined,
    include: formationInclude,
    orderBy: { createdAt: "desc" },
  });
  const [media, blocks] = await Promise.all([
    mediaForFormations(rows.map((row) => row.id)),
    contentBlocksForOwner("FORMATION_GUIDE", rows.map((row) => row.id)),
  ]);
  return rows.map((row) =>
    toFormation(row, media.get(row.id) ?? [], blocks.get(row.id) ?? [])
  );
}

export async function getFormationBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean; publishOnly?: boolean } = {}
): Promise<FormationDto | null> {
  const row = await prisma.formationGuide.findUnique({
    where: { slug },
    include: formationInclude,
  });
  if (!row) return null;
  if (opts.includeUnpublished && row.status !== "PUBLISHED") return null;
  if (opts.publishOnly && row.status !== "PUBLISHED") return null;
  const [media, blocks] = await Promise.all([
    mediaForFormations([row.id]),
    contentBlocksForOwner("FORMATION_GUIDE", [row.id]),
  ]);
  return toFormation(row, media.get(row.id) ?? [], blocks.get(row.id) ?? []);
}