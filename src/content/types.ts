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
}

export interface SocialLink {
  platform: string;
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
