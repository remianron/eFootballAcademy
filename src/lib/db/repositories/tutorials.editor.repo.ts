import { prisma } from "@/lib/db/client";
import type { Prisma, PublishStatus } from "@/generated/prisma/client";
import type { TutorialEditorInput } from "@/lib/tutorial-editor/types";
import {
  hasTutorialErrors,
  validateTutorialEditorInput,
} from "@/lib/tutorial-editor/validation";
import {
  normalizeContentMedia,
  type NormalizedContentMedia,
} from "@/lib/content-editor/media-input";
import { normalizeContentBlocks } from "@/lib/content-blocks/validation";
import type { NormalizedContentBlock } from "@/lib/content-blocks/types";
import { syncContentBlocks } from "@/lib/db/repositories/content-blocks.repo";
import { EditorFieldError } from "@/lib/content-editor/errors";

export type SaveTutorialResult =
  | {
      ok: true;
      tutorial: { id: string; slug: string; status: PublishStatus };
    }
  | { ok: false; errors: Record<string, string> };

type Tx = Prisma.TransactionClient;

type NormalizedTutorial = {
  title: string;
  slug: string;
  category: TutorialEditorInput["category"];
  difficulty: TutorialEditorInput["difficulty"];
  description: string;
  content: string;
  steps: string[];
  tips: string[];
  media: NormalizedContentMedia[];
  blocks: NormalizedContentBlock[];
  status: PublishStatus;
};

function normalizeTutorial(input: TutorialEditorInput): NormalizedTutorial {
  const trim = (value: string) => value.trim();
  return {
    title: trim(input.title),
    slug: trim(input.slug),
    category: input.category,
    difficulty: input.difficulty,
    description: trim(input.description),
    content: trim(input.content),
    steps: input.steps.map(trim),
    tips: input.tips.map(trim),
    media: normalizeContentMedia(input.media),
    blocks: normalizeContentBlocks(input.blocks),
    status: input.status,
  };
}

async function syncSteps(
  tx: Tx,
  tutorialId: string,
  steps: string[]
): Promise<void> {
  const trimmed = steps.filter(Boolean);
  await tx.tutorialStep.deleteMany({ where: { tutorialId } });
  if (trimmed.length > 0) {
    await tx.tutorialStep.createMany({
      data: trimmed.map((text, index) => ({
        tutorialId,
        text,
        order: index + 1,
      })),
    });
  }
}

async function syncMedia(
  tx: Tx,
  tutorialId: string,
  media: NormalizedContentMedia[]
): Promise<void> {
  await tx.media.deleteMany({
    where: { ownerType: "TUTORIAL", ownerId: tutorialId },
  });
  if (media.length > 0) {
    await tx.media.createMany({
      data: media.map((item, index) => ({
        ownerType: "TUTORIAL",
        ownerId: tutorialId,
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
  data: NormalizedTutorial,
  tutorialId: string | undefined
): Promise<{ ok: true; tutorial: { id: string; slug: string; status: PublishStatus } }> {
  const existing = tutorialId
    ? await tx.tutorial.findUnique({ where: { id: tutorialId } })
    : null;
  if (tutorialId && !existing) {
    throw new EditorFieldError({ _form: "Tutorial not found." });
  }
  const duplicate = await tx.tutorial.findFirst({
    where: { slug: data.slug, ...(tutorialId ? { id: { not: tutorialId } } : {}) },
  });
  if (duplicate) {
    throw new EditorFieldError({
      slug: "This slug is already used by another tutorial.",
    });
  }

  const fields = {
    title: data.title,
    slug: data.slug,
    category: data.category,
    difficulty: data.difficulty,
    description: data.description,
    content: data.content,
    tips: data.tips,
    status: data.status,
  };

  const tutorial = existing
    ? await tx.tutorial.update({
        where: { id: existing.id },
        data: {
          ...fields,
          publishedAt:
            existing.publishedAt ??
            (data.status === "PUBLISHED" ? new Date() : null),
        },
      })
    : await tx.tutorial.create({
        data: {
          ...fields,
          publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        },
      });

  await syncSteps(tx, tutorial.id, data.steps);
  await syncMedia(tx, tutorial.id, data.media);
  await syncContentBlocks(tx, "TUTORIAL", tutorial.id, data.blocks);

  return {
    ok: true,
    tutorial: { id: tutorial.id, slug: tutorial.slug, status: tutorial.status },
  };
}

export async function saveTutorial(
  input: TutorialEditorInput,
  opts: { tutorialId?: string } = {}
): Promise<SaveTutorialResult> {
  const errors = validateTutorialEditorInput(input, {
    requirePublishable: input.status === "PUBLISHED",
  });
  if (hasTutorialErrors(errors)) return { ok: false, errors };
  const data = normalizeTutorial(input);
  try {
    return await prisma.$transaction((tx) =>
      saveInTransaction(tx, data, opts.tutorialId)
    );
  } catch (error) {
    if (error instanceof EditorFieldError) {
      return { ok: false, errors: error.errors };
    }
    throw error;
  }
}

export async function setTutorialStatus(
  tutorialId: string,
  status: PublishStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.tutorial.findUnique({
    where: { id: tutorialId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Tutorial not found." };
  await prisma.tutorial.update({ where: { id: tutorialId }, data: { status } });
  return { ok: true };
}

export async function deleteDraftTutorial(
  tutorialId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.tutorial.findUnique({
    where: { id: tutorialId },
    select: { status: true },
  });
  if (!existing) return { ok: false, error: "Tutorial not found." };
  if (existing.status !== "DRAFT") {
    return { ok: false, error: "Only drafts can be deleted." };
  }
  await prisma.$transaction([
    prisma.media.deleteMany({
      where: { ownerType: "TUTORIAL", ownerId: tutorialId },
    }),
    prisma.contentBlock.deleteMany({
      where: { ownerType: "TUTORIAL", ownerId: tutorialId },
    }),
    prisma.tutorial.delete({ where: { id: tutorialId } }),
  ]);
  return { ok: true };
}