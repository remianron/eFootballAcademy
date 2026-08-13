"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import {
  deleteFeaturedItem,
  saveFeaturedItem,
  setFeaturedItemActive,
} from "@/lib/db/repositories/featured.editor.repo";
import type { FeaturedEditorInput } from "@/lib/featured-editor/types";

export type FeaturedSaveResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export async function createFeaturedItemAction(
  input: FeaturedEditorInput
): Promise<FeaturedSaveResult> {
  const result = await saveFeaturedItem(input);
  if (!result.ok) return result;
  revalidatePath("/admin/featured");
  redirect(`/admin/featured/${result.item.id}/edit`);
}

export async function updateFeaturedItemAction(
  featuredItemId: string,
  input: FeaturedEditorInput
): Promise<FeaturedSaveResult> {
  const result = await saveFeaturedItem(input, { featuredItemId });
  if (!result.ok) return result;
  revalidatePath("/admin/featured");
  revalidatePath(`/admin/featured/${featuredItemId}/edit`);
  redirect(`/admin/featured/${featuredItemId}/edit`);
}

export async function toggleFeaturedItemAction(
  featuredItemId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const item = await prisma.featuredItem.findUnique({
    where: { id: featuredItemId },
    select: { active: true },
  });
  if (!item) return { ok: false, error: "Featured item not found." };
  const result = await setFeaturedItemActive(featuredItemId, !item.active);
  if (!result.ok) return result;
  revalidatePath("/admin/featured");
  return { ok: true };
}

export async function deleteFeaturedItemAction(
  featuredItemId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await deleteFeaturedItem(featuredItemId);
  if (!result.ok) return result;
  revalidatePath("/admin/featured");
  redirect("/admin/featured");
}