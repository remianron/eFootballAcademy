"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteDraftCoach,
  saveCoach,
  setCoachStatus,
} from "@/lib/db/repositories/coaches.editor.repo";
import type { CoachEditorInput } from "@/lib/coach-editor/types";

export type CoachSaveResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };

export async function createCoachAction(
  input: CoachEditorInput
): Promise<CoachSaveResult> {
  const result = await saveCoach(input);
  if (!result.ok) return result;
  revalidatePath("/admin/coaches");
  redirect(`/admin/coaches/${result.coach.id}/edit`);
}

export async function updateCoachAction(
  coachId: string,
  input: CoachEditorInput
): Promise<CoachSaveResult> {
  const result = await saveCoach(input, { coachId });
  if (!result.ok) return result;
  revalidatePath("/admin/coaches");
  revalidatePath(`/admin/coaches/${coachId}/edit`);
  redirect(`/admin/coaches/${coachId}/edit`);
}

export async function archiveCoachAction(
  coachId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await setCoachStatus(coachId, "ARCHIVED");
  if (!result.ok) return result;
  revalidatePath("/admin/coaches");
  revalidatePath(`/admin/coaches/${coachId}/edit`);
  redirect(`/admin/coaches/${coachId}/edit`);
}

export async function restoreCoachAction(
  coachId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await setCoachStatus(coachId, "DRAFT");
  if (!result.ok) return result;
  revalidatePath("/admin/coaches");
  revalidatePath(`/admin/coaches/${coachId}/edit`);
  redirect(`/admin/coaches/${coachId}/edit`);
}

export async function deleteCoachAction(
  coachId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await deleteDraftCoach(coachId);
  if (!result.ok) return result;
  revalidatePath("/admin/coaches");
  redirect("/admin/coaches");
}