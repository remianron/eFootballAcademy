import { prisma } from "@/lib/db/client";
import type { CoachDto, MediaDto, SocialLinkDto } from "@/lib/db/types";
import { listFromJson } from "@/lib/db/types";
import type { Prisma } from "@/generated/prisma/client";

function toSocialLink(row: { platform: string; url: string; order: number }): SocialLinkDto {
  return { platform: row.platform, url: row.url, order: row.order };
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

const coachInclude = {
  socialLinks: { orderBy: { order: "asc" } },
} as const;

export type CoachIncludeRow = Prisma.CoachGetPayload<{
  include: typeof coachInclude;
}>;

export interface CoachOverviewRow {
  id: string;
  slug: string;
  name: string;
  status: CoachDto["status"];
  bookingEnabled: boolean;
  updatedAt: string;
}

export async function getCoachById(id: string): Promise<CoachDto | null> {
  const row = await prisma.coach.findUnique({
    where: { id },
    include: coachInclude,
  });
  if (!row) return null;
  const media = await mediaForCoaches([row.id]);
  return toCoach(row, media.get(row.id) ?? []);
}

export async function listCoachesOverview(): Promise<CoachOverviewRow[]> {
  const rows = await prisma.coach.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      status: true,
      bookingEnabled: true,
      updatedAt: true,
    },
    orderBy: { name: "asc" },
  });
  return rows.map((row) => ({
    ...row,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

function toCoach(
  row: {
    id: string;
    slug: string;
    name: string;
    bio: string;
    coachingDescription: string;
    specialties: unknown;
    bookingEnabled: boolean;
    socialLinks: { platform: string; url: string; order: number }[];
    status: CoachDto["status"];
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  media: MediaDto[]
): CoachDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    bio: row.bio,
    coachingDescription: row.coachingDescription,
    specialties: listFromJson(row.specialties),
    bookingEnabled: row.bookingEnabled,
    socialLinks: row.socialLinks.map(toSocialLink),
    status: row.status,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    media,
  };
}

async function mediaForCoaches(coachIds: string[]): Promise<Map<string, MediaDto[]>> {
  const rows = await prisma.media.findMany({
    where: { ownerType: "COACH", ownerId: { in: coachIds } },
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

export async function listCoaches(publishOnly = false): Promise<CoachDto[]> {
  const rows = await prisma.coach.findMany({
    where: publishOnly ? { status: "PUBLISHED" } : undefined,
    include: coachInclude,
    orderBy: { name: "asc" },
  });
  const media = await mediaForCoaches(rows.map((row) => row.id));
  return rows.map((row) => toCoach(row, media.get(row.id) ?? []));
}

export async function getCoachBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean; publishOnly?: boolean } = {}
): Promise<CoachDto | null> {
  const row = await prisma.coach.findUnique({
    where: { slug },
    include: coachInclude,
  });
  if (!row) return null;
  if (opts.includeUnpublished && row.status !== "PUBLISHED") return null;
  if (opts.publishOnly && row.status !== "PUBLISHED") return null;
  const media = await mediaForCoaches([row.id]);
  return toCoach(row, media.get(row.id) ?? []);
}