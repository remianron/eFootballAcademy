export type PublishStatus = "draft" | "published" | "archived";

export interface Media {
  src: string;
  alt: string;
}

interface BaseContent {
  id: string;
  slug: string;
  title: string;
  publishedStatus: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContentMediaType = "video" | "gif" | "image";

export interface ContentMedia {
  type: ContentMediaType;
  url?: string;
  youtubeVideoId?: string;
  thumbnail?: string;
  caption?: string;
  aspectRatio?: string;
  alt?: string;
}

export type ContentBlockType =
  | "heading"
  | "text"
  | "media"
  | "attributes"
  | "custom"
  | "mixed"
  | "quote"
  | "divider"
  | "spacer";

/**
 * Ordered editorial content block (flexible CMS). Rendered in stored
 * order by the shared ContentBlockList renderer.
 */
export type ContentBlock =
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "text"; content: string }
  | { type: "media"; media: ContentMedia[] }
  | { type: "attributes"; items: { name: string; value: string }[] }
  | { type: "custom"; label: string; content: string }
  | {
      type: "mixed";
      media: ContentMedia[];
      content: string;
      side: "media" | "text";
    }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "divider" }
  | { type: "spacer"; size: "sm" | "md" | "lg" };

export type FeedbackPlatform = "YouTube" | "Facebook" | "Instagram" | "TikTok";

export interface CommunityFeedback {
  platform: FeedbackPlatform;
  author: string;
  comment: string;
  profileUrl?: string;
  avatar?: Media;
  date?: string;
  verified?: boolean;
}

export interface PlayerBuild extends BaseContent {
  playerName: string;
  cardName: string;
  position: string;
  overall: number;
  buildName: string;
  shortDescription: string;
  philosophy: string;
  keyAttributes: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendedFor: string[];
  avoidFor: string[];
  skills?: string[];
  media?: ContentMedia[];
  blocks?: ContentBlock[];
  communityFeedback?: CommunityFeedback[];
}

export type TutorialCategory =
  | "free-kicks"
  | "skills"
  | "dribbling"
  | "passing"
  | "shooting"
  | "corners"
  | "mechanics";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Tutorial extends BaseContent {
  category: TutorialCategory;
  description: string;
  thumbnail?: Media;
  videoUrl?: string;
  content: string;
  difficulty: Difficulty;
  steps?: string[];
  tips?: string[];
  media?: ContentMedia[];
  blocks?: ContentBlock[];
}

export interface PlayerRole {
  position: string;
  description: string;
}

export interface FormationGuide extends BaseContent {
  formation: string;
  playstyle: string;
  description: string;
  diagram?: Media;
  playerRoles: PlayerRole[];
  tacticalInstructions: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedUsage: string;
  media?: ContentMedia[];
  blocks?: ContentBlock[];
}

export type DiscoveryCategory =
  | "efootball-science"
  | "experiments"
  | "community"
  | "mechanics"
  | "updates"
  | "meta";

export type ResearchStatus = "example" | "field-verified";

export interface Discovery extends BaseContent {
  category: DiscoveryCategory;
  excerpt: string;
  thumbnail?: Media;
  content: string;
  findings?: string[];
  author: string;
  sources?: string[];
  publishedAt?: string;
  researchStatus?: ResearchStatus;
  media?: ContentMedia[];
  blocks?: ContentBlock[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

/**
 * Global site social link (footer + floating widget). Derived from the
 * SiteSocialLink table — published rows only; never contains internal
 * fields like published/sortOrder/timestamps.
 */
export interface SiteSocialLink {
  platform: string;
  label: string;
  url: string;
}

export interface Coach {
  id: string;
  slug: string;
  name: string;
  profileImage?: Media;
  bio: string;
  specialties: string[];
  socialLinks: SocialLink[];
  coachingDescription: string;
  status: "active" | "hidden";
  booking?: { enabled: boolean };
  media?: ContentMedia[];
  blocks?: ContentBlock[];
}

export type ContentType =
  | "build"
  | "tutorial"
  | "formation-guide"
  | "discovery"
  | "coach";

export type FeaturedPlacement = "hero" | "featured" | "sidebar" | "latest";

export interface FeaturedItem {
  type: ContentType;
  contentId: string;
  placement: FeaturedPlacement;
  order: number;
  active: boolean;
}