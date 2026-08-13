"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteDraftFormation,
  saveFormation,
  setFormationStatus,
} from "@/lib/db/repositories/formations.editor.repo";
import type { FormationEditorInput } from "@/lib/formation-editor/types";

export type FormationSaveResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export async function createFormationAction(
  input: FormationEditorInput
): Promise<FormationSaveResult> {
  const result = await saveFormation(input);
  if (!result.ok) return result;
  revalidatePath("/admin/formations");
  redirect(`/admin/formations/${result.formation.id}/edit`);
}

export async function updateFormationAction(
  formationGuideId: string,
  input: FormationEditorInput
): Promise<FormationSaveResult> {
  const result = await saveFormation(input, { formationGuideId });
  if (!result.ok) return result;
  revalidatePath("/admin/formations");
  revalidatePath(`/admin/formations/${formationGuideId}/edit`);
  redirect(`/admin/formations/${formationGuideId}/edit`);
}

export async function archiveFormationAction(
  formationGuideId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await setFormationStatus(formationGuideId, "ARCHIVED");
  if (!result.ok) return result;
  revalidatePath("/admin/formations");
  revalidatePath(`/admin/formations/${formationGuideId}/edit`);
  redirect(`/admin/formations/${formationGuideId}/edit`);
}

export async function restoreFormationAction(
  formationGuideId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await setFormationStatus(formationGuideId, "DRAFT");
  if (!result.ok) return result;
  revalidatePath("/admin/formations");
  revalidatePath(`/admin/formations/${formationGuideId}/edit`);
  redirect(`/admin/formations/${formationGuideId}/edit`);
}

export async function deleteFormationAction(
  formationGuideId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await deleteDraftFormation(formationGuideId);
  if (!result.ok) return result;
  revalidatePath("/admin/formations");
  redirect("/admin/formations");
}