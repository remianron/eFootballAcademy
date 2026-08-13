"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteDraftDiscovery,
  saveDiscovery,
  setDiscoveryStatus,
} from "@/lib/db/repositories/discoveries.editor.repo";
import type { DiscoveryEditorInput } from "@/lib/discovery-editor/types";
import {
  dataSourceFailure,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";

export type DiscoverySaveResult =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string };

export async function createDiscoveryAction(
  input: DiscoveryEditorInput
): Promise<DiscoverySaveResult> {
  try {
    const result = await saveDiscovery(input);
    if (!result.ok) return result;
    revalidatePath("/admin/discoveries");
    redirect(`/admin/discoveries/${result.discovery.id}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function updateDiscoveryAction(
  discoveryId: string,
  input: DiscoveryEditorInput
): Promise<DiscoverySaveResult> {
  try {
    const result = await saveDiscovery(input, { discoveryId });
    if (!result.ok) return result;
    revalidatePath("/admin/discoveries");
    revalidatePath(`/admin/discoveries/${discoveryId}/edit`);
    redirect(`/admin/discoveries/${discoveryId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function archiveDiscoveryAction(
  discoveryId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await setDiscoveryStatus(discoveryId, "ARCHIVED");
    if (!result.ok) return result;
    revalidatePath("/admin/discoveries");
    revalidatePath(`/admin/discoveries/${discoveryId}/edit`);
    redirect(`/admin/discoveries/${discoveryId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function restoreDiscoveryAction(
  discoveryId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await setDiscoveryStatus(discoveryId, "DRAFT");
    if (!result.ok) return result;
    revalidatePath("/admin/discoveries");
    revalidatePath(`/admin/discoveries/${discoveryId}/edit`);
    redirect(`/admin/discoveries/${discoveryId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function deleteDiscoveryAction(
  discoveryId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await deleteDraftDiscovery(discoveryId);
    if (!result.ok) return result;
    revalidatePath("/admin/discoveries");
    redirect("/admin/discoveries");
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}