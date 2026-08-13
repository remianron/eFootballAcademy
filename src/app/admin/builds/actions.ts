"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteDraftBuild,
  saveBuild,
  setBuildStatus,
} from "@/lib/db/repositories/builds.editor.repo";
import type { BuildEditorInput } from "@/lib/build-editor/types";

export type ActionErrors = Record<string, string>;

export type SaveActionResult = { ok: true } | { ok: false; errors: ActionErrors };

export async function createBuildAction(
  input: BuildEditorInput
): Promise<SaveActionResult> {
  const result = await saveBuild(input);
  if (!result.ok) return result;
  revalidatePath("/admin/builds");
  redirect(`/admin/builds/${result.build.id}/edit`);
}

export async function updateBuildAction(
  buildId: string,
  input: BuildEditorInput
): Promise<SaveActionResult> {
  const result = await saveBuild(input, { buildId });
  if (!result.ok) return result;
  revalidatePath("/admin/builds");
  revalidatePath(`/admin/builds/${buildId}/edit`);
  redirect(`/admin/builds/${buildId}/edit`);
}

export async function archiveBuildAction(
  buildId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await setBuildStatus(buildId, "ARCHIVED");
  if (!result.ok) return result;
  revalidatePath("/admin/builds");
  revalidatePath(`/admin/builds/${buildId}/edit`);
  redirect(`/admin/builds/${buildId}/edit`);
}

export async function restoreBuildAction(
  buildId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await setBuildStatus(buildId, "DRAFT");
  if (!result.ok) return result;
  revalidatePath("/admin/builds");
  revalidatePath(`/admin/builds/${buildId}/edit`);
  redirect(`/admin/builds/${buildId}/edit`);
}

export async function deleteBuildAction(
  buildId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await deleteDraftBuild(buildId);
  if (!result.ok) return result;
  revalidatePath("/admin/builds");
  redirect("/admin/builds");
}