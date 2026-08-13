"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteDraftTutorial,
  saveTutorial,
  setTutorialStatus,
} from "@/lib/db/repositories/tutorials.editor.repo";
import type { TutorialEditorInput } from "@/lib/tutorial-editor/types";
import {
  dataSourceFailure,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";

export type TutorialActionErrors = Record<string, string>;

export type TutorialSaveResult =
  | { ok: true }
  | { ok: false; errors?: TutorialActionErrors; error?: string };

export async function createTutorialAction(
  input: TutorialEditorInput
): Promise<TutorialSaveResult> {
  try {
    const result = await saveTutorial(input);
    if (!result.ok) return result;
    revalidatePath("/admin/tutorials");
    redirect(`/admin/tutorials/${result.tutorial.id}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function updateTutorialAction(
  tutorialId: string,
  input: TutorialEditorInput
): Promise<TutorialSaveResult> {
  try {
    const result = await saveTutorial(input, { tutorialId });
    if (!result.ok) return result;
    revalidatePath("/admin/tutorials");
    revalidatePath(`/admin/tutorials/${tutorialId}/edit`);
    redirect(`/admin/tutorials/${tutorialId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function archiveTutorialAction(
  tutorialId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await setTutorialStatus(tutorialId, "ARCHIVED");
    if (!result.ok) return result;
    revalidatePath("/admin/tutorials");
    revalidatePath(`/admin/tutorials/${tutorialId}/edit`);
    redirect(`/admin/tutorials/${tutorialId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function restoreTutorialAction(
  tutorialId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await setTutorialStatus(tutorialId, "DRAFT");
    if (!result.ok) return result;
    revalidatePath("/admin/tutorials");
    revalidatePath(`/admin/tutorials/${tutorialId}/edit`);
    redirect(`/admin/tutorials/${tutorialId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function deleteTutorialAction(
  tutorialId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await deleteDraftTutorial(tutorialId);
    if (!result.ok) return result;
    revalidatePath("/admin/tutorials");
    redirect("/admin/tutorials");
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}