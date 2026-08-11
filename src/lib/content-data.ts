import { builds } from "@/content/builds";
import { tutorials } from "@/content/tutorials";
import { formations } from "@/content/formations";
import { discoveries } from "@/content/discoveries";
import { coaches } from "@/content/coaches";
import { featuredContent } from "@/content/featured";
import type {
  Coach,
  Discovery,
  FeaturedItem,
  FormationGuide,
  PlayerBuild,
  Tutorial,
} from "@/content/types";

/**
 * Single content registry for the whole application.
 *
 * Both the public access layer (src/lib/content.ts) and the admin access
 * layer (src/lib/admin.ts) read from here. Content definitions live in
 * src/content/; a future database/API can replace the data source behind
 * this registry without changing page components.
 */

export type ContentEntity =
  | PlayerBuild
  | Tutorial
  | FormationGuide
  | Discovery
  | Coach;

export type ContentCollectionMap = {
  build: PlayerBuild[];
  tutorial: Tutorial[];
  "formation-guide": FormationGuide[];
  discovery: Discovery[];
  coach: Coach[];
};

export const contentCollections: ContentCollectionMap = {
  build: builds,
  tutorial: tutorials,
  "formation-guide": formations,
  discovery: discoveries,
  coach: coaches,
};

export const featuredItems: FeaturedItem[] = featuredContent;

export function isContentPublished(content: ContentEntity): boolean {
  return "publishedStatus" in content
    ? content.publishedStatus === "published"
    : content.status === "active";
}

export function isContentDraft(content: ContentEntity): boolean {
  return "publishedStatus" in content
    ? content.publishedStatus === "draft"
    : content.status === "hidden";
}
