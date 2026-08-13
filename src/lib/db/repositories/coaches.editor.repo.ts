import { prisma } from "@/lib/db/client";
import type { Prisma, PublishStatus } from "@/generated/prisma/client";
import type { CoachEditorInput } from "@/lib/coach-editor/types";
import {
  hasCoachErrors,
  validateCoachEditorInput,
} from "@/lib/coach-editor/validation";
import {
  normalizeContentMedia,
  type NormalizedContentMedia,
} from "@/lib/content-editor/media-input";
import { EditorFieldError } from "@/lib/content-editor/errors";

export type SaveCoachResult =
  | { ok: true; coach: { id: string; slug: string; status: PublishStatus } }
  | { ok: false; errors: Record<string, string> };

type Tx = Prisma.TransactionClient;

type NormalizedCoach = {
  name: string;
  slug: string;
  bio: string;
  coachingDescription: string;
  specialties: string[];
  bookingEnabled: boolean;
  socialLinks: { platform: string; url: string }[];
  media: NormalizedContentMedia[];
  status: PublishStatus;
};

function normalizeCoach(input: CoachEditorInput): NormalizedCoach {
  const trim = (value: string) => value.trim();
  return {
    name: trim(input.name),
    slug: trim(input.slug),
    bio: trim(input.bio),
    coachingDescription: trim(input.coachingDescription),
    specialties: input.specialties.map(trim),
    bookingEnabled: input.bookingEnabled,
    socialLinks: input.socialLinks
      .map((link) => ({ platform: trim(link.platform), url: trim(link.url) }))
      .filter((link) => Boolean(link.platform) || Boolean(link.url)),
    media: normalizeContentMedia(input.media),
    status: input.status,
  };
}

async function syncSocialLinks(
  tx: Tx,
  coachId: string,
  socialLinks: { platform: string; url: string }[]
): Promise<void> {
  await tx.coachSocialLink.deleteMany({ where: { coachId } });
  if (socialLinks.length > 0) {
    await tx.coachSocialLink.createMany({
      data: socialLinks.map((link, index) => ({
        coachId,
        platform: link.platform,
        url: link.url,
        order: index + 1,
      })),
    });
  }
}

async function syncMedia(
  tx: Tx,
  coachId: string,
  media: NormalizedContentMedia[]
): Promise<void> {
  await tx.media.deleteMany({
    where: { ownerType: "COACH", ownerId: coachId },
  });
  if (media.length > 0) {
    await tx.media.createMany({
      data: media.map((item, index) => ({
        ownerType: "COACH",
        ownerId: coachId,
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
  data: NormalizedCoach,
  coachId: string | undefined
): Promise<{ ok: true; coach: { id: string; slug: string; status: PublishStatus } }> {
  const existing = coachId
    ? await tx.coach.findUnique({ where: { id: coachId } })
    : null;
  if (coachId && !existing) {
    throw new EditorFieldError({ _form: "Coach not found." });
  }
  const duplicate = await tx.coach.findFirst({
    where: { slug: data.slug, ...(coachId ? { id: { not: coachId } } : {}) },
  });
  if (duplicate) {
    throw new EditorFieldError({
      slug: "This slug is already used by another coach.",
    });
  }

  const fields = {
    name: data.name,
    slug: data.slug,
    bio: data.bio,
    coachingDescription: data.coachingDescription,
    specialties: data.specialties,
    bookingEnabled: data.bookingEnabled,
    status: data.status,
  };

  const coach = existing
    ? await tx.coach.update({
        where: { id: existing.id },
        data: {
          ...fields,
          publishedAt:
            existing.publishedAt ??
            (data.status === "PUBLISHED" ? new Date() : null),
        },
      })
    : await tx.coach.create({
        data: {
          ...fields,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        },
      });

  await syncSocialLinks(tx, coach.id, data.socialLinks);
  await syncMedia(tx, coach.id, data.media);

  return {
    ok: true,
    coach: { id: coach.id, slug: coach.slug, status: coach.status },
  };
}

export async function saveCoach(
  input: CoachEditorInput,
  opts: { coachId?: string } = {}
): Promise<SaveCoachResult> {
  const errors = validateCoachEditorInput(input, {
    requirePublishable: input.status === "PUBLISHED",
  });
  if (hasCoachErrors(errors)) return { ok: false, errors };
  const data = normalizeCoach(input);
  try {
    return await prisma.$transaction((tx) =>
      saveInTransaction(tx, data, opts.coachId)
    );
  } catch (error) {
    if (error instanceof EditorFieldError) {
      return { ok: false, errors: error.errors };
    }
    throw error;
  }
}

export async function setCoachStatus(
  coachId: string,
  status: PublishStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.coach.findUnique({
    where: { id: coachId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Coach not found." };
  await prisma.coach.update({ where: { id: coachId }, data: { status } });
  return { ok: true };
}

export async function deleteDraftCoach(
  coachId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.coach.findUnique({
    where: { id: coachId },
    select: { status: true },
  });
  if (!existing) return { ok: false, error: "Coach not found." };
  if (existing.status !== "DRAFT") {
    return { ok: false, error: "Only drafts can be deleted." };
  }
  await prisma.$transaction([
    prisma.media.deleteMany({
      where: { ownerType: "COACH", ownerId: coachId },
    }),
    prisma.coach.delete({ where: { id: coachId } }),
  ]);
  return { ok: true };
}