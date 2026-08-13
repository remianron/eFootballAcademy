"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteDraftBuild,
  saveBuild,
  setBuildStatus,
} from "@/lib/db/repositories/builds.editor.repo";
import type { BuildEditorInput } from "@/lib/build-editor/types";
import {
  dataSourceFailure,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";

export type ActionErrors = Record<string, string>;

export type SaveActionResult =
  | { ok: true }
  | { ok: false; errors?: ActionErrors; error?: string };

export async function createBuildAction(
  input: BuildEditorInput
): Promise<SaveActionResult> {
  try {
    const result = await saveBuild(input);
    if (!result.ok) return result;
    revalidatePath("/admin/builds");
    redirect(`/admin/builds/${result.build.id}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function updateBuildAction(
  buildId: string,
  input: BuildEditorInput
): Promise<SaveActionResult> {
  try {
    const result = await saveBuild(input, { buildId });
    if (!result.ok) return result;
    revalidatePath("/admin/builds");
    revalidatePath(`/admin/builds/${buildId}/edit`);
    redirect(`/admin/builds/${buildId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function archiveBuildAction(
  buildId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await setBuildStatus(buildId, "ARCHIVED");
    if (!result.ok) return result;
    revalidatePath("/admin/builds");
    revalidatePath(`/admin/builds/${buildId}/edit`);
    redirect(`/admin/builds/${buildId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function restoreBuildAction(
  buildId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await setBuildStatus(buildId, "DRAFT");
    if (!result.ok) return result;
    revalidatePath("/admin/builds");
    revalidatePath(`/admin/builds/${buildId}/edit`);
    redirect(`/admin/builds/${buildId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function deleteBuildAction(
  buildId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await deleteDraftBuild(buildId);
    if (!result.ok) return result;
    revalidatePath("/admin/builds");
    redirect("/admin/builds");
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}