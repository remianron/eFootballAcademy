import { prisma } from "@/lib/db/client";
import type { ContentBlockDto, MediaDto, TutorialDto, TutorialStepDto } from "@/lib/db/types";
import { listFromJson } from "@/lib/db/types";
import { contentBlocksForOwner } from "@/lib/db/repositories/content-blocks.repo";
import type { PublishStatus, Prisma } from "@/generated/prisma/client";

function toStep(row: { text: string; order: number }): TutorialStepDto {
  return { text: row.text, order: row.order };
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

const tutorialInclude = {
  steps: { orderBy: { order: "asc" } },
} as const;

export type TutorialIncludeRow = Prisma.TutorialGetPayload<{
  include: typeof tutorialInclude;
}>;

function toTutorial(
  row: {
    id: string;
    slug: string;
    title: string;
    category: TutorialDto["category"];
    description: string;
    content: string;
    difficulty: TutorialDto["difficulty"];
    tips: unknown;
    steps: { text: string; order: number }[];
    status: TutorialDto["status"];
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  media: MediaDto[],
  blocks: ContentBlockDto[]
): TutorialDto {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    content: row.content,
    difficulty: row.difficulty,
    tips: listFromJson(row.tips),
    steps: row.steps.map(toStep),
    status: row.status,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    media,
    blocks,
  };
}

async function mediaForTutorials(
  tutorialIds: string[]
): Promise<Map<string, MediaDto[]>> {
  const rows = await prisma.media.findMany({
    where: { ownerType: "TUTORIAL", ownerId: { in: tutorialIds } },
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

export async function listTutorials(publishOnly = false): Promise<TutorialDto[]> {
  const rows = await prisma.tutorial.findMany({
    where: publishOnly ? { status: "PUBLISHED" } : undefined,
    include: tutorialInclude,
    orderBy: { createdAt: "desc" },
  });
  const [media, blocks] = await Promise.all([
    mediaForTutorials(rows.map((row) => row.id)),
    contentBlocksForOwner("TUTORIAL", rows.map((row) => row.id)),
  ]);
  return rows.map((row) =>
    toTutorial(row, media.get(row.id) ?? [], blocks.get(row.id) ?? [])
  );
}

export async function getTutorialBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean; publishOnly?: boolean } = {}
): Promise<TutorialDto | null> {
  const row = await prisma.tutorial.findUnique({
    where: { slug },
    include: tutorialInclude,
  });
  if (!row) return null;
  if (opts.includeUnpublished && row.status !== "PUBLISHED") return null;
  if (opts.publishOnly && row.status !== "PUBLISHED") return null;
  const [media, blocks] = await Promise.all([
    mediaForTutorials([row.id]),
    contentBlocksForOwner("TUTORIAL", [row.id]),
  ]);
  return toTutorial(row, media.get(row.id) ?? [], blocks.get(row.id) ?? []);
}

export async function getTutorialById(
  id: string
): Promise<TutorialDto | null> {
  const row = await prisma.tutorial.findUnique({
    where: { id },
    include: tutorialInclude,
  });
  if (!row) return null;
  const [media, blocks] = await Promise.all([
    mediaForTutorials([row.id]),
    contentBlocksForOwner("TUTORIAL", [row.id]),
  ]);
  return toTutorial(row, media.get(row.id) ?? [], blocks.get(row.id) ?? []);
}

export interface TutorialCardRowDto {
  id: string;
  slug: string;
  title: string;
  category: TutorialDto["category"];
  difficulty: TutorialDto["difficulty"];
  description: string;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export async function listPublishedTutorialsForPublic(): Promise<TutorialCardRowDto[]> {
  const rows = await prisma.tutorial.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      difficulty: true,
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

export interface TutorialOverviewRow {
  id: string;
  slug: string;
  title: string;
  category: TutorialDto["category"];
  difficulty: TutorialDto["difficulty"];
  status: PublishStatus;
  updatedAt: string;
}

export async function listTutorialsOverview(): Promise<TutorialOverviewRow[]> {
  const rows = await prisma.tutorial.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      difficulty: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    difficulty: row.difficulty,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
  }));
}