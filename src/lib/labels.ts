import type {
  ContentType,
  Difficulty,
  DiscoveryCategory,
  FeaturedPlacement,
  PublishStatus,
  ResearchStatus,
  TutorialCategory,
} from "@/content/types";

export const TUTORIAL_CATEGORY_LABELS: Record<TutorialCategory, string> = {
  "free-kicks": "Free Kicks",
  skills: "Skills",
  dribbling: "Dribbling",
  passing: "Passing",
  shooting: "Shooting",
  corners: "Corners",
  mechanics: "Mechanics",
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  build: "Player Build",
  tutorial: "Tutorial",
  "formation-guide": "Formation Guide",
  discovery: "Discovery",
  coach: "Coach",
};

export const CONTENT_TYPE_PLURAL_LABELS: Record<ContentType, string> = {
  build: "Player Builds",
  tutorial: "Tutorials",
  "formation-guide": "Formation Guides",
  discovery: "Discoveries",
  coach: "Coaches",
};

export const FEATURED_PLACEMENT_LABELS: Record<FeaturedPlacement, string> = {
  hero: "Hero",
  featured: "Featured",
  sidebar: "Sidebar",
  latest: "Latest",
};

export const PUBLISH_STATUS_LABELS: Record<PublishStatus, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

export const TUTORIAL_CATEGORY_ORDER: TutorialCategory[] = [
  "free-kicks",
  "skills",
  "dribbling",
  "passing",
  "shooting",
  "corners",
  "mechanics",
];

export const DISCOVERY_CATEGORY_LABELS: Record<DiscoveryCategory, string> = {
  "efootball-science": "eFootball Science",
  experiments: "Experiments",
  community: "Community",
  mechanics: "Mechanics",
  updates: "Updates",
  meta: "Meta",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const RESEARCH_STATUS_LABELS: Record<ResearchStatus, string> = {
  example: "Example Research",
  "field-verified": "Field Verified",
};

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDuration(minutes: number): string {
  return `${minutes} minutes`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function paragraphs(content: string): string[] {
  return content.split("\n\n").filter(Boolean);
}
