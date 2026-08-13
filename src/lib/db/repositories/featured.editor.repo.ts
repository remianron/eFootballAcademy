import { prisma } from "@/lib/db/client";
import type {
  FeaturedContentType,
  FeaturedPlacement,
} from "@/generated/prisma/client";
import { findContentRef } from "@/lib/db/repositories/featured.repo";
import type { FeaturedEditorInput } from "@/lib/featured-editor/types";
import {
  hasFeaturedErrors,
  validateFeaturedEditorInput,
} from "@/lib/featured-editor/validation";
import { EditorFieldError } from "@/lib/content-editor/errors";

export type SaveFeaturedResult =
  | { ok: true; item: { id: string } }
  | { ok: false; errors: Record<string, string> };

type NormalizedFeatured = {
  contentType: FeaturedContentType;
  contentId: string;
  placement: FeaturedPlacement;
  order: number;
  active: boolean;
};

function normalizeFeatured(input: FeaturedEditorInput): NormalizedFeatured {
  return {
    contentType: input.contentType,
    contentId: input.contentId.trim(),
    placement: input.placement,
    order: input.order,
    active: input.active,
  };
}

export async function saveFeaturedItem(
  input: FeaturedEditorInput,
  opts: { featuredItemId?: string } = {}
): Promise<SaveFeaturedResult> {
  const errors = validateFeaturedEditorInput(input);
  if (hasFeaturedErrors(errors)) return { ok: false, errors };
  const data = normalizeFeatured(input);

  const existing = opts.featuredItemId
    ? await prisma.featuredItem.findUnique({
        where: { id: opts.featuredItemId },
      })
    : null;
  if (opts.featuredItemId && !existing) {
    return { ok: false, errors: { _form: "Featured item not found." } };
  }
  if (existing && existing.contentType !== data.contentType) {
    return { ok: false, errors: { contentType: "Content type cannot change after creation." } };
  }

  const content = await findContentRef(data.contentType, data.contentId);
  if (!content) {
    return { ok: false, errors: { contentId: "This content no longer exists." } };
  }

  const duplicate = await prisma.featuredItem.findFirst({
    where: {
      contentType: data.contentType,
      contentId: data.contentId,
      placement: data.placement,
      ...(opts.featuredItemId ? { id: { not: opts.featuredItemId } } : {}),
    },
  });
  if (duplicate) {
    return { ok: false, errors: { _form: "This item is already featured in this placement." } };
  }

  try {
    const item = existing
      ? await prisma.featuredItem.update({
          where: { id: existing.id },
          data: {
            contentId: data.contentId,
            placement: data.placement,
            order: data.order,
            active: data.active,
          },
        })
      : await prisma.featuredItem.create({
          data: {
            contentType: data.contentType,
            contentId: data.contentId,
            placement: data.placement,
            order: data.order,
            active: data.active,
          },
        });

    return { ok: true, item: { id: item.id } };
  } catch (error) {
    if (
      error instanceof EditorFieldError ||
      (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002")
    ) {
      return { ok: false, errors: { _form: "This item is already featured in this placement." } };
    }
    throw error;
  }
}

export async function setFeaturedItemActive(
  featuredItemId: string,
  active: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.featuredItem.findUnique({
    where: { id: featuredItemId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Featured item not found." };
  await prisma.featuredItem.update({
    where: { id: featuredItemId },
    data: { active },
  });
  return { ok: true };
}

export async function deleteFeaturedItem(
  featuredItemId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.featuredItem.findUnique({
    where: { id: featuredItemId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Featured item not found." };
  await prisma.featuredItem.delete({ where: { id: featuredItemId } });
  return { ok: true };
}