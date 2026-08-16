import {
  getBuildById,
  getBuildBySlug as getBuildDtoBySlug,
  listPublishedBuildsForPublic,
  listPublishedVariantsForCard,
} from "@/lib/db/repositories/builds.repo";
import {
  getTutorialById,
  getTutorialBySlug as getTutorialDtoBySlug,
  listPublishedTutorialsForPublic,
} from "@/lib/db/repositories/tutorials.repo";
import {
  getFormationById,
  getFormationBySlug as getFormationDtoBySlug,
  listPublishedFormationsForPublic,
} from "@/lib/db/repositories/formations.repo";
import {
  getDiscoveryById,
  getDiscoveryBySlug as getDiscoveryDtoBySlug,
  listPublishedDiscoveriesForPublic,
} from "@/lib/db/repositories/discoveries.repo";
import {
  getCoachById,
  getCoachBySlug as getCoachDtoBySlug,
  listCoaches,
} from "@/lib/db/repositories/coaches.repo";
import { listFeaturedEntries } from "@/lib/db/repositories/featured.repo";
import { listPublishedSiteSocialLinks } from "@/lib/db/repositories/social-links.repo";
import {
  toPublicBuild,
  toPublicBuildCard,
  toPublicCoach,
  toPublicDiscovery,
  toPublicDiscoveryCard,
  toPublicFormation,
  toPublicFormationCard,
  toPublicSiteSocialLinks,
  toPublicTutorial,
  toPublicTutorialCard,
} from "@/lib/public/mappers";
import type { FeaturedEntryDto } from "@/lib/db/types";
import type {
  Coach,
  Discovery,
  FeaturedItem,
  FeaturedPlacement,
  FormationGuide,
  PlayerBuild,
  SiteSocialLink,
  Tutorial,
} from "@/content/types";

export type FeaturedEntry =
  | (FeaturedItem & { type: "build"; content: PlayerBuild })
  | (FeaturedItem & { type: "tutorial"; content: Tutorial })
  | (FeaturedItem & { type: "formation-guide"; content: FormationGuide })
  | (FeaturedItem & { type: "discovery"; content: Discovery })
  | (FeaturedItem & { type: "coach"; content: Coach });

const CONTENT_TYPE_MAP = {
  BUILD: "build",
  TUTORIAL: "tutorial",
  FORMATION_GUIDE: "formation-guide",
  DISCOVERY: "discovery",
  COACH: "coach",
} as const;

const PLACEMENT_MAP = {
  HERO: "hero",
  FEATURED: "featured",
  SIDEBAR: "sidebar",
  LATEST: "latest",
} as const;

export function getPublishedBuilds(): Promise<PlayerBuild[]> {
  return listPublishedBuildsForPublic().then(
    (rows) => rows.map((row) => toPublicBuildCard(row))
  );
}

export function getPublishedBuildBySlug(
  slug: string
): Promise<PlayerBuild | null> {
  return getBuildDtoBySlug(slug, { publishOnly: true }).then((build) =>
    build ? toPublicBuild(build) : null
  );
}

export function getPublishedBuildsForCard(
  playerName: string,
  cardName: string
): Promise<PlayerBuild[]> {
  return listPublishedVariantsForCard(playerName, cardName).then((rows) =>
    rows.map((row) => toPublicBuildCard(row))
  );
}

export function getPublishedTutorials(): Promise<Tutorial[]> {
  return listPublishedTutorialsForPublic().then((rows) =>
    rows.map((row) => toPublicTutorialCard(row))
  );
}

export function getPublishedTutorialBySlug(
  slug: string
): Promise<Tutorial | null> {
  return getTutorialDtoBySlug(slug, { publishOnly: true }).then((tutorial) =>
    tutorial ? toPublicTutorial(tutorial) : null
  );
}

export function getPublishedFormations(): Promise<FormationGuide[]> {
  return listPublishedFormationsForPublic().then((rows) =>
    rows.map((row) => toPublicFormationCard(row))
  );
}

export function getPublishedFormationBySlug(
  slug: string
): Promise<FormationGuide | null> {
  return getFormationDtoBySlug(slug, { publishOnly: true }).then((formation) =>
    formation ? toPublicFormation(formation) : null
  );
}

export function getPublishedDiscoveries(): Promise<Discovery[]> {
  return listPublishedDiscoveriesForPublic().then((rows) =>
    rows.map((row) => toPublicDiscoveryCard(row))
  );
}

export function getPublishedDiscoveryBySlug(
  slug: string
): Promise<Discovery | null> {
  return getDiscoveryDtoBySlug(slug, { publishOnly: true }).then((discovery) =>
    discovery ? toPublicDiscovery(discovery) : null
  );
}

export function getPublishedCoaches(): Promise<Coach[]> {
  return listCoaches(true).then((coaches) => coaches.map((coach) => toPublicCoach(coach)));
}

export function getPublishedSiteSocialLinks(): Promise<SiteSocialLink[]> {
  return listPublishedSiteSocialLinks().then(toPublicSiteSocialLinks);
}

export function getPublishedCoachBySlug(slug: string): Promise<Coach | null> {
  return getCoachDtoBySlug(slug, { publishOnly: true }).then((coach) =>
    coach ? toPublicCoach(coach) : null
  );
}

async function resolveFeaturedEntry(
  entry: FeaturedEntryDto
): Promise<FeaturedEntry | null> {
  const type = CONTENT_TYPE_MAP[entry.contentType];
  const placement = PLACEMENT_MAP[entry.placement];
  const base: FeaturedItem = {
    type,
    contentId: entry.contentId,
    placement,
    order: entry.order,
    active: entry.active,
  };

  let content: PlayerBuild | Tutorial | FormationGuide | Discovery | Coach | null =
    null;
  if (entry.contentType === "BUILD") {
    const build = await getBuildById(entry.contentId);
    content = build && build.status === "PUBLISHED" ? toPublicBuild(build) : null;
  } else if (entry.contentType === "TUTORIAL") {
    const tutorial = await getTutorialById(entry.contentId);
    content =
      tutorial && tutorial.status === "PUBLISHED" ? toPublicTutorial(tutorial) : null;
  } else if (entry.contentType === "FORMATION_GUIDE") {
    const formation = await getFormationById(entry.contentId);
    content =
      formation && formation.status === "PUBLISHED"
        ? toPublicFormation(formation)
        : null;
  } else if (entry.contentType === "DISCOVERY") {
    const discovery = await getDiscoveryById(entry.contentId);
    content =
      discovery && discovery.status === "PUBLISHED"
        ? toPublicDiscovery(discovery)
        : null;
  } else {
    const coach = await getCoachById(entry.contentId);
    content = coach && coach.status === "PUBLISHED" ? toPublicCoach(coach) : null;
  }

  if (!content) return null;
  return { ...base, content } as FeaturedEntry;
}

export async function getActiveFeaturedContent(
  placement?: FeaturedPlacement
): Promise<FeaturedEntry[]> {
  const entries = await listFeaturedEntries({
    placement: placement
      ? (placement.toUpperCase() as FeaturedEntryDto["placement"])
      : undefined,
    onlyActive: true,
    publishOnly: true,
  });
  const resolved = await Promise.all(entries.map(resolveFeaturedEntry));
  return resolved
    .filter((entry): entry is FeaturedEntry => entry !== null)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedContent(
  placement?: FeaturedPlacement
): Promise<FeaturedEntry[]> {
  return getActiveFeaturedContent(placement);
}