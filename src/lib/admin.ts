import {
  contentCollections,
  featuredItems,
  isContentDraft,
  isContentPublished,
  type ContentEntity,
} from "@/lib/content-data";
import type {
  Coach,
  ContentType,
  Discovery,
  FeaturedItem,
  FormationGuide,
  PlayerBuild,
  Tutorial,
} from "@/content/types";

/**
 * Admin content access layer.
 *
 * The admin area must see drafts, hidden items and everything the public
 * layer filters out, so it reads from the shared content registry
 * (src/lib/content-data.ts) instead of individual content modules.
 *
 * Like src/lib/content.ts, this file is the only allowed entry point for
 * admin components — a future API can replace the data source behind
 * these functions without touching the UI.
 */

export interface ContentOverviewEntry {
  type: ContentType;
  total: number;
  published: number;
  drafts: number;
}

export interface AdminFeaturedEntry {
  item: FeaturedItem;
  /** Resolved public title of the referenced content. */
  title: string;
  /** True when the referenced content id still exists in the registry. */
  resolved: boolean;
  /** Public site route for the content, when resolvable. */
  href: string | null;
}

function countStatuses(collection: ContentEntity[]): {
  total: number;
  published: number;
  drafts: number;
} {
  return {
    total: collection.length,
    published: collection.filter(isContentPublished).length,
    drafts: collection.filter(isContentDraft).length,
  };
}

export function getContentOverview(): Promise<ContentOverviewEntry[]> {
  const types = Object.keys(contentCollections) as ContentType[];
  return Promise.resolve(
    types.map((type) => {
      const { total, published, drafts } = countStatuses(
        contentCollections[type]
      );
      return { type, total, published, drafts };
    })
  );
}

function byUpdatedAtDesc<T extends { updatedAt: string }>(
  list: T[]
): T[] {
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getAdminBuilds(): Promise<PlayerBuild[]> {
  return Promise.resolve(byUpdatedAtDesc(contentCollections.build));
}

export function getAdminTutorials(): Promise<Tutorial[]> {
  return Promise.resolve(byUpdatedAtDesc(contentCollections.tutorial));
}

export function getAdminFormationGuides(): Promise<FormationGuide[]> {
  return Promise.resolve(byUpdatedAtDesc(contentCollections["formation-guide"]));
}

export function getAdminDiscoveries(): Promise<Discovery[]> {
  return Promise.resolve(byUpdatedAtDesc(contentCollections.discovery));
}

export function getAdminCoaches(): Promise<Coach[]> {
  return Promise.resolve([...contentCollections.coach]);
}

const publicRouteByType: Record<ContentType, string> = {
  build: "/builds",
  tutorial: "/tutorials",
  "formation-guide": "/formations",
  discovery: "/discoveries",
  coach: "/coaching",
};

export function getAdminFeatured(): Promise<AdminFeaturedEntry[]> {
  return Promise.resolve(
    featuredItems
      .map((item) => {
        const content = contentCollections[item.type].find(
          (candidate) => candidate.id === item.contentId
        );
        const title = content
          ? "title" in content
            ? content.title
            : content.name
          : "Missing content";
        return {
          item,
          title,
          resolved: Boolean(content),
          href: content ? `${publicRouteByType[item.type]}/${content.slug}` : null,
        };
      })
      .sort(
        (a, b) =>
          a.item.placement.localeCompare(b.item.placement) ||
          a.item.order - b.item.order
      )
  );
}
