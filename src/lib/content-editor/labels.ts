import type {
  Difficulty,
  DiscoveryCategory,
  FeaturedContentType,
  FeaturedPlacement,
  ResearchStatus,
  TutorialCategory,
} from "@/generated/prisma/client";

export const TUTORIAL_CATEGORY_LABELS: Record<TutorialCategory, string> = {
  FREE_KICKS: "Free Kicks",
  SKILLS: "Skills",
  DRIBBLING: "Dribbling",
  PASSING: "Passing",
  SHOOTING: "Shooting",
  CORNERS: "Corners",
  MECHANICS: "Mechanics",
};

export const TUTORIAL_CATEGORY_OPTIONS = Object.entries(
  TUTORIAL_CATEGORY_LABELS
).map(([value, label]) => ({ value, label }));

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const DISCOVERY_CATEGORY_LABELS: Record<DiscoveryCategory, string> = {
  EFOOTBALL_SCIENCE: "eFootball Science",
  EXPERIMENTS: "Experiments",
  COMMUNITY: "Community",
  MECHANICS: "Mechanics",
  UPDATES: "Updates",
  META: "Meta",
};

export const DISCOVERY_CATEGORY_OPTIONS = Object.entries(
  DISCOVERY_CATEGORY_LABELS
).map(([value, label]) => ({ value, label }));

export const RESEARCH_STATUS_LABELS: Record<ResearchStatus, string> = {
  EXAMPLE: "Example Research",
  FIELD_VERIFIED: "Field Verified",
};

export const RESEARCH_STATUS_OPTIONS = Object.entries(
  RESEARCH_STATUS_LABELS
).map(([value, label]) => ({ value, label }));

export const FEATURED_PLACEMENT_LABELS: Record<FeaturedPlacement, string> = {
  HERO: "Hero",
  FEATURED: "Featured",
  SIDEBAR: "Sidebar",
  LATEST: "Latest",
};

export const FEATURED_PLACEMENT_OPTIONS = Object.entries(
  FEATURED_PLACEMENT_LABELS
).map(([value, label]) => ({ value, label }));

export const FEATURED_CONTENT_TYPE_LABELS: Record<
  FeaturedContentType,
  string
> = {
  BUILD: "Player Build",
  TUTORIAL: "Tutorial",
  FORMATION_GUIDE: "Formation Guide",
  DISCOVERY: "Discovery",
  COACH: "Coach",
};

export const FEATURED_CONTENT_TYPE_OPTIONS = Object.entries(
  FEATURED_CONTENT_TYPE_LABELS
).map(([value, label]) => ({ value, label }));