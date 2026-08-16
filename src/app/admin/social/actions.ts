"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteSiteSocialLink,
  saveSiteSocialLink,
  setSiteSocialLinkPublished,
} from "@/lib/db/repositories/social-links.repo";
import type { SiteSocialLinkInput } from "@/lib/social-links/types";
import {
  dataSourceFailure,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";

export type SiteSocialLinkSaveResult =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string };

export async function createSiteSocialLinkAction(
  input: SiteSocialLinkInput
): Promise<SiteSocialLinkSaveResult> {
  try {
    const result = await saveSiteSocialLink(input);
    if (!result.ok) return result;
    revalidatePath("/");
    revalidatePath("/admin/social");
    redirect(`/admin/social/${result.link.id}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function updateSiteSocialLinkAction(
  linkId: string,
  input: SiteSocialLinkInput
): Promise<SiteSocialLinkSaveResult> {
  try {
    const result = await saveSiteSocialLink(input, { linkId });
    if (!result.ok) return result;
    revalidatePath("/");
    revalidatePath("/admin/social");
    redirect(`/admin/social/${linkId}/edit`);
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function deleteSiteSocialLinkAction(
  linkId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await deleteSiteSocialLink(linkId);
    if (!result.ok) return result;
    revalidatePath("/");
    revalidatePath("/admin/social");
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function toggleSiteSocialLinkAction(
  linkId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const result = await setSiteSocialLinkPublished(linkId);
    if (!result.ok) return result;
    revalidatePath("/");
    revalidatePath("/admin/social");
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}