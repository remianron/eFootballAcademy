import { prisma } from "@/lib/db/client";
import type {
  FeaturedContentReferenceDto,
  FeaturedEntryDto,
} from "@/lib/db/types";
import type {
  FeaturedContentType,
  FeaturedPlacement,
  PublishStatus,
} from "@/generated/prisma/client";
import type { FeaturedCatalog } from "@/lib/featured-editor/types";

type ContentRef = {
  id: string;
  slug: string;
  title: string | null;
  status: FeaturedContentReferenceDto["status"];
} | null;

export { findContentRef };

function toFeaturedContent(
  contentType: FeaturedContentType,
  contentId: string,
  row: ContentRef
): FeaturedContentReferenceDto {
  return {
    contentType,
    contentId,
    slug: row?.slug ?? null,
    title: row?.title ?? null,
    status: row?.status ?? null,
  };
}

async function findContentRef(
  contentType: FeaturedContentType,
  contentId: string
): Promise<ContentRef> {
  const publishedAtField = {
    id: true,
    slug: true,
    status: true,
  } as const;

  if (contentType === "BUILD") {
    const row = await prisma.build.findFirst({
      where: { id: contentId },
      select: {
        ...publishedAtField,
        buildName: true,
      },
    });
    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      title: row.buildName,
      status: row.status,
    };
  }

  if (contentType === "TUTORIAL") {
    const row = await prisma.tutorial.findFirst({
      where: { id: contentId },
      select: { ...publishedAtField, title: true },
    });
    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
    };
  }

  if (contentType === "FORMATION_GUIDE") {
    const row = await prisma.formationGuide.findFirst({
      where: { id: contentId },
      select: { ...publishedAtField, title: true },
    });
    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
    };
  }

  if (contentType === "DISCOVERY") {
    const row = await prisma.discovery.findFirst({
      where: { id: contentId },
      select: { ...publishedAtField, title: true },
    });
    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
    };
  }

  const row = await prisma.coach.findFirst({
    where: { id: contentId },
    select: { ...publishedAtField, name: true },
  });
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.name,
    status: row.status,
  };
}

export async function listFeaturedEntries(
  opts: { placement?: FeaturedPlacement; onlyActive?: boolean; publishOnly?: boolean } = {}
): Promise<FeaturedEntryDto[]> {
  const items = await prisma.featuredItem.findMany({
    where: {
      ...(opts.placement ? { placement: opts.placement } : {}),
      ...(opts.onlyActive ? { active: true } : {}),
    },
    orderBy: [{ placement: "asc" }, { order: "asc" }],
  });

  const resolved: FeaturedEntryDto[] = [];
  for (const item of items) {
    const content = await findContentRef(item.contentType, item.contentId);

    if (opts.publishOnly && (!content || content.status !== "PUBLISHED")) {
      continue;
    }

    resolved.push({
      id: item.id,
      contentType: item.contentType,
      contentId: item.contentId,
      placement: item.placement,
      order: item.order,
      active: item.active,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      content: toFeaturedContent(item.contentType, item.contentId, content),
    });
  }

  return resolved;
}

export async function listFeaturedPlacements(): Promise<
  { placement: FeaturedPlacement; total: number; active: number }[]
> {
  const items = await prisma.featuredItem.groupBy({
    by: ["placement"],
    _count: { _all: true },
  });
  const activeRows = await prisma.featuredItem.groupBy({
    by: ["placement"],
    where: { active: true },
    _count: { _all: true },
  });
  const activeCounts = new Map(activeRows.map((g) => [g.placement, g._count._all]));
  return items
    .map((group) => ({
      placement: group.placement,
      total: group._count._all,
      active: activeCounts.get(group.placement) ?? 0,
    }))
    .sort((a, b) => a.placement.localeCompare(b.placement));
}

export async function listFeaturedCatalog(
  contentType: FeaturedContentType
): Promise<{ id: string; slug: string; title: string; status: PublishStatus }[]> {
  const where = { status: "PUBLISHED" as const };
  if (contentType === "BUILD") {
    const rows = await prisma.build.findMany({
      where,
      select: { id: true, slug: true, buildName: true, status: true },
      orderBy: { buildName: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.buildName,
      status: row.status,
    }));
  }
  if (contentType === "COACH") {
    const rows = await prisma.coach.findMany({
      where,
      select: { id: true, slug: true, name: true, status: true },
      orderBy: { name: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.name,
      status: row.status,
    }));
  }
  if (contentType === "TUTORIAL") {
    const rows = await prisma.tutorial.findMany({
      where,
      select: { id: true, slug: true, title: true, status: true },
      orderBy: { title: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
    }));
  }
  if (contentType === "FORMATION_GUIDE") {
    const rows = await prisma.formationGuide.findMany({
      where,
      select: { id: true, slug: true, title: true, status: true },
      orderBy: { title: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      status: row.status,
    }));
  }
  const rows = await prisma.discovery.findMany({
    where,
    select: { id: true, slug: true, title: true, status: true },
    orderBy: { title: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
  }));
}

export async function getFeaturedCatalog(): Promise<FeaturedCatalog> {
  const entries = await Promise.all([
    listFeaturedCatalog("BUILD"),
    listFeaturedCatalog("TUTORIAL"),
    listFeaturedCatalog("FORMATION_GUIDE"),
    listFeaturedCatalog("DISCOVERY"),
    listFeaturedCatalog("COACH"),
  ]);
  return {
    BUILD: entries[0],
    TUTORIAL: entries[1],
    FORMATION_GUIDE: entries[2],
    DISCOVERY: entries[3],
    COACH: entries[4],
  };
}

export async function getFeaturedEntryById(
  id: string
): Promise<FeaturedEntryDto | null> {
  const item = await prisma.featuredItem.findUnique({ where: { id } });
  if (!item) return null;
  const content = await findContentRef(item.contentType, item.contentId);
  return {
    id: item.id,
    contentType: item.contentType,
    contentId: item.contentId,
    placement: item.placement,
    order: item.order,
    active: item.active,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    content: toFeaturedContent(item.contentType, item.contentId, content),
  };
}