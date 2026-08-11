import {
  contentCollections,
  featuredItems,
  isContentPublished,
} from "@/lib/content-data";
import type {
  Coach,
  Discovery,
  FeaturedItem,
  FeaturedPlacement,
  FormationGuide,
  PlayerBuild,
  Tutorial,
} from "@/content/types";

export type { ContentEntity } from "@/lib/content-data";

export type FeaturedEntry =
  | (FeaturedItem & { type: "build"; content: PlayerBuild })
  | (FeaturedItem & { type: "tutorial"; content: Tutorial })
  | (FeaturedItem & { type: "formation-guide"; content: FormationGuide })
  | (FeaturedItem & { type: "discovery"; content: Discovery })
  | (FeaturedItem & { type: "coach"; content: Coach });

const collections = contentCollections;

const builds = collections.build;
const tutorials = collections.tutorial;
const formations = collections["formation-guide"];
const discoveries = collections.discovery;
const coaches = collections.coach;

function resolveFeatured(placement?: FeaturedPlacement): FeaturedEntry[] {
  return featuredItems
    .filter(
      (item) =>
        item.active && (placement === undefined || item.placement === placement)
    )
    .flatMap((item) => {
      const content = collections[item.type].find(
        (candidate) => candidate.id === item.contentId
      );
      if (!content || !isContentPublished(content)) return [];
      return [{ ...item, content }] as FeaturedEntry[];
    })
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedContent(
  placement?: FeaturedPlacement
): Promise<FeaturedEntry[]> {
  return Promise.resolve(resolveFeatured(placement));
}

export function getBuilds(): Promise<PlayerBuild[]> {
  const published = builds.filter(
    (build) => build.publishedStatus === "published"
  );
  return Promise.resolve(
    [...published].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function getBuildsForCard(
  playerName: string,
  cardName: string
): Promise<PlayerBuild[]> {
  return getBuilds().then((list) =>
    list.filter(
      (build) =>
        build.playerName === playerName && build.cardName === cardName
    )
  );
}

export function getBuildBySlug(slug: string): Promise<PlayerBuild | null> {
  return getBuilds().then(
    (list) => list.find((build) => build.slug === slug) ?? null
  );
}

export function getTutorials(): Promise<Tutorial[]> {
  const published = tutorials.filter(
    (tutorial) => tutorial.publishedStatus === "published"
  );
  return Promise.resolve(
    [...published].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  return getTutorials().then(
    (list) => list.find((tutorial) => tutorial.slug === slug) ?? null
  );
}

export function getFormationGuides(): Promise<FormationGuide[]> {
  const published = formations.filter(
    (formation) => formation.publishedStatus === "published"
  );
  return Promise.resolve(
    [...published].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function getFormationGuideBySlug(
  slug: string
): Promise<FormationGuide | null> {
  return getFormationGuides().then(
    (list) => list.find((formation) => formation.slug === slug) ?? null
  );
}

export function getDiscoveries(): Promise<Discovery[]> {
  const published = discoveries.filter(
    (discovery) => discovery.publishedStatus === "published"
  );
  return Promise.resolve(
    [...published].sort(
      (a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
    )
  );
}

export function getDiscoveryBySlug(slug: string): Promise<Discovery | null> {
  return getDiscoveries().then(
    (list) => list.find((discovery) => discovery.slug === slug) ?? null
  );
}

export function getCoaches(): Promise<Coach[]> {
  return Promise.resolve(coaches.filter((coach) => coach.status === "active"));
}

export function getCoachBySlug(slug: string): Promise<Coach | null> {
  return getCoaches().then(
    (list) => list.find((coach) => coach.slug === slug) ?? null
  );
}
