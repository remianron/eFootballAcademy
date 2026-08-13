import { prisma } from "@/lib/db/client";
import type { MediaDto } from "@/lib/db/types";
import type { MediaOwnerType } from "@/generated/prisma/client";

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

export async function getMediaForOwner(
  ownerType: MediaOwnerType,
  ownerId: string
): Promise<MediaDto[]> {
  const rows = await prisma.media.findMany({
    where: { ownerType, ownerId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toMedia);
}

export async function getPrimaryMediaForOwner(
  ownerType: MediaOwnerType,
  ownerId: string
): Promise<MediaDto | null> {
  const row = await prisma.media.findFirst({
    where: { ownerType, ownerId, isPrimary: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return row ? toMedia(row) : null;
}