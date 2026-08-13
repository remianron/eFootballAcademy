import { prisma } from "@/lib/db/client";
import type { Prisma, PublishStatus } from "@/generated/prisma/client";
import type { FormationEditorInput } from "@/lib/formation-editor/types";
import {
  hasFormationErrors,
  validateFormationEditorInput,
} from "@/lib/formation-editor/validation";
import {
  normalizeContentMedia,
  type NormalizedContentMedia,
} from "@/lib/content-editor/media-input";
import { EditorFieldError } from "@/lib/content-editor/errors";

export type SaveFormationResult =
  | {
      ok: true;
      formation: { id: string; slug: string; status: PublishStatus };
    }
  | { ok: false; errors: Record<string, string> };

type Tx = Prisma.TransactionClient;

type NormalizedFormation = {
  title: string;
  slug: string;
  formation: string;
  playstyle: string;
  description: string;
  recommendedUsage: string;
  tacticalInstructions: string[];
  strengths: string[];
  weaknesses: string[];
  roles: NormalizedFormationRole[];
  media: NormalizedContentMedia[];
  status: PublishStatus;
};

type NormalizedFormationRole = { position: string; description: string };

function normalizeFormation(input: FormationEditorInput): NormalizedFormation {
  const trim = (value: string) => value.trim();
  return {
    title: trim(input.title),
    slug: trim(input.slug),
    formation: trim(input.formation),
    playstyle: trim(input.playstyle),
    description: trim(input.description),
    recommendedUsage: trim(input.recommendedUsage),
    tacticalInstructions: input.tacticalInstructions.map(trim),
    strengths: input.strengths.map(trim),
    weaknesses: input.weaknesses.map(trim),
    roles: input.roles
      .map((role) => ({
        position: trim(role.position),
        description: trim(role.description),
      }))
      .filter((role) => Boolean(role.position) || Boolean(role.description)),
    media: normalizeContentMedia(input.media),
    status: input.status,
  };
}

async function syncRoles(
  tx: Tx,
  formationGuideId: string,
  roles: NormalizedFormationRole[]
): Promise<void> {
  await tx.formationPlayerRole.deleteMany({
    where: { formationGuideId },
  });
  if (roles.length > 0) {
    await tx.formationPlayerRole.createMany({
      data: roles.map((role, index) => ({
        formationGuideId,
        position: role.position,
        description: role.description,
        order: index + 1,
      })),
    });
  }
}

async function syncMedia(
  tx: Tx,
  formationGuideId: string,
  media: NormalizedContentMedia[]
): Promise<void> {
  await tx.media.deleteMany({
    where: { ownerType: "FORMATION_GUIDE", ownerId: formationGuideId },
  });
  if (media.length > 0) {
    await tx.media.createMany({
      data: media.map((item, index) => ({
        ownerType: "FORMATION_GUIDE",
        ownerId: formationGuideId,
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
  data: NormalizedFormation,
  formationGuideId: string | undefined
): Promise<{ ok: true; formation: { id: string; slug: string; status: PublishStatus } }> {
  const existing = formationGuideId
    ? await tx.formationGuide.findUnique({ where: { id: formationGuideId } })
    : null;
  if (formationGuideId && !existing) {
    throw new EditorFieldError({ _form: "Formation not found." });
  }
  const duplicate = await tx.formationGuide.findFirst({
    where: {
      slug: data.slug,
      ...(formationGuideId ? { id: { not: formationGuideId } } : {}),
    },
  });
  if (duplicate) {
    throw new EditorFieldError({
      slug: "This slug is already used by another formation guide.",
    });
  }

  const fields = {
    title: data.title,
    slug: data.slug,
    formation: data.formation,
    playstyle: data.playstyle,
    description: data.description,
    recommendedUsage: data.recommendedUsage,
    tacticalInstructions: data.tacticalInstructions,
    strengths: data.strengths,
    weaknesses: data.weaknesses,
    status: data.status,
  };

  const formation = existing
    ? await tx.formationGuide.update({
        where: { id: existing.id },
        data: {
          ...fields,
          publishedAt:
            existing.publishedAt ??
            (data.status === "PUBLISHED" ? new Date() : null),
        },
      })
    : await tx.formationGuide.create({
        data: {
          ...fields,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        },
      });

  await syncRoles(tx, formation.id, data.roles);
  await syncMedia(tx, formation.id, data.media);

  return {
    ok: true,
    formation: {
      id: formation.id,
      slug: formation.slug,
      status: formation.status,
    },
  };
}

export async function saveFormation(
  input: FormationEditorInput,
  opts: { formationGuideId?: string } = {}
): Promise<SaveFormationResult> {
  const errors = validateFormationEditorInput(input, {
    requirePublishable: input.status === "PUBLISHED",
  });
  if (hasFormationErrors(errors)) return { ok: false, errors };
  const data = normalizeFormation(input);
  try {
    return await prisma.$transaction((tx) =>
      saveInTransaction(tx, data, opts.formationGuideId)
    );
  } catch (error) {
    if (error instanceof EditorFieldError) {
      return { ok: false, errors: error.errors };
    }
    throw error;
  }
}

export async function setFormationStatus(
  formationGuideId: string,
  status: PublishStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.formationGuide.findUnique({
    where: { id: formationGuideId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Formation not found." };
  await prisma.formationGuide.update({
    where: { id: formationGuideId },
    data: { status },
  });
  return { ok: true };
}

export async function deleteDraftFormation(
  formationGuideId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.formationGuide.findUnique({
    where: { id: formationGuideId },
    select: { status: true },
  });
  if (!existing) return { ok: false, error: "Formation not found." };
  if (existing.status !== "DRAFT") {
    return { ok: false, error: "Only drafts can be deleted." };
  }
  await prisma.$transaction([
    prisma.media.deleteMany({
      where: { ownerType: "FORMATION_GUIDE", ownerId: formationGuideId },
    }),
    prisma.formationGuide.delete({ where: { id: formationGuideId } }),
  ]);
  return { ok: true };
}