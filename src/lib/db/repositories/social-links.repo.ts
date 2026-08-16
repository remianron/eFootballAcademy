import { prisma } from "@/lib/db/client";
import type { Prisma } from "@/generated/prisma/client";
import type { SiteSocialLinkDto } from "@/lib/db/types";
import type { SiteSocialLinkInput } from "@/lib/social-links/types";
import {
  hasSiteSocialLinkErrors,
  validateSiteSocialLinkInput,
} from "@/lib/social-links/validation";
import { EditorFieldError } from "@/lib/content-editor/errors";

type Tx = Prisma.TransactionClient;

const SITE_SOCIAL_URL_PATTERN = /^https?:\/\/\S+$/;

function toDto(row: {
  id: string;
  platform: string;
  label: string;
  url: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}): SiteSocialLinkDto {
  return {
    id: row.id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listAllSiteSocialLinks(): Promise<SiteSocialLinkDto[]> {
  const rows = await prisma.siteSocialLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toDto);
}

export async function getSiteSocialLinkById(
  id: string
): Promise<SiteSocialLinkDto | null> {
  const row = await prisma.siteSocialLink.findUnique({ where: { id } });
  return row ? toDto(row) : null;
}

/**
 * Public data source: published links only, in display order. Unpublished
 * rows never leave the database layer.
 */
export async function listPublishedSiteSocialLinks(): Promise<SiteSocialLinkDto[]> {
  const rows = await prisma.siteSocialLink.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toDto);
}

export type SaveSiteSocialLinkResult =
  | { ok: true; link: { id: string } }
  | { ok: false; errors: Record<string, string> };

export async function saveSiteSocialLink(
  input: SiteSocialLinkInput,
  opts: { linkId?: string } = {}
): Promise<SaveSiteSocialLinkResult> {
  const errors = validateSiteSocialLinkInput(input);
  if (hasSiteSocialLinkErrors(errors)) return { ok: false, errors };

  const data = {
    platform: input.platform.trim(),
    label: input.label.trim(),
    url: input.url.trim(),
    published: input.published,
    sortOrder: input.sortOrder,
  };

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = opts.linkId
        ? await tx.siteSocialLink.findUnique({ where: { id: opts.linkId } })
        : null;
      if (opts.linkId && !existing) {
        throw new EditorFieldError({ _form: "Social link not found." });
      }
      const link = existing
        ? await tx.siteSocialLink.update({ where: { id: existing.id }, data })
        : await tx.siteSocialLink.create({ data });
      await renumberSiteSocialLinks(tx);
      return { ok: true, link: { id: link.id } };
    });
  } catch (error) {
    if (error instanceof EditorFieldError) {
      return { ok: false, errors: error.errors };
    }
    throw error;
  }
}

export async function deleteSiteSocialLink(
  linkId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.siteSocialLink.findUnique({
    where: { id: linkId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Social link not found." };
  await prisma.$transaction(async (tx) => {
    await tx.siteSocialLink.delete({ where: { id: linkId } });
    await renumberSiteSocialLinks(tx);
  });
  return { ok: true };
}

/**
 * Publish/unpublish toggle. Publishing is blocked while the URL is not a
 * real https:// destination so placeholder values can never go live.
 */
export async function setSiteSocialLinkPublished(
  linkId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.siteSocialLink.findUnique({
    where: { id: linkId },
  });
  if (!existing) return { ok: false, error: "Social link not found." };
  const published = !existing.published;
  if (published && !SITE_SOCIAL_URL_PATTERN.test(existing.url.trim())) {
    return {
      ok: false,
      error: "Enter a valid https:// URL before publishing this link.",
    };
  }
  await prisma.siteSocialLink.update({
    where: { id: linkId },
    data: { published },
  });
  return { ok: true };
}

/**
 * Normalizes sortOrder to a contiguous 1..N sequence by current order so
 * the admin list always shows clean, editable ordering.
 */
async function renumberSiteSocialLinks(tx: Tx): Promise<void> {
  const rows = await tx.siteSocialLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, sortOrder: true },
  });
  const updates = rows
    .map((row, index) => ({ row, expected: index + 1 }))
    .filter(({ row, expected }) => row.sortOrder !== expected);
  for (const { row, expected } of updates) {
    await tx.siteSocialLink.update({
      where: { id: row.id },
      data: { sortOrder: expected },
    });
  }
}