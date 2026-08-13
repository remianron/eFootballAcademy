import type {
  DiscoveryCategory,
  Difficulty,
  FeaturedContentType,
  FeedbackPlatform,
  MediaKind,
  MediaOwnerType,
  PublishStatus,
  ResearchStatus,
  StatCategory,
  TutorialCategory,
} from "@/generated/prisma/client";

/**
 * Shared DTO types for the repository layer.
 *
 * JSON-typed simple lists (skills, tips, sources, …) are exposed as
 * string[] here — the DB stores them as JSON because MySQL has no native
 * array type.
 */

export function listFromJson(
  value: unknown
): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function listFromJsonNullable(
  value: unknown
): string[] {
  if (value === null || value === undefined) return [];
  return listFromJson(value);
}

export interface AttributeDto {
  id: string;
  key: string;
  name: string;
  category: StatCategory;
  sortIndex: number;
  active: boolean;
}

export interface StatisticEntryDto {
  attributeKey: string;
  attributeName: string;
  category: StatCategory;
  value: number;
  isKey: boolean;
  keyOrder: number | null;
}

export interface FeedbackEntryDto {
  platform: FeedbackPlatform;
  author: string;
  comment: string;
  profileUrl: string | null;
  avatarUrl: string | null;
  date: Date | null;
  verified: boolean;
}

export interface MediaDto {
  id: string;
  ownerType: MediaOwnerType;
  ownerId: string;
  kind: MediaKind;
  youtubeVideoId: string | null;
  aspectRatio: string;
  thumbnailUrl: string | null;
  url: string | null;
  alt: string | null;
  caption: string | null;
  isPrimary: boolean;
  order: number;
}

export interface BuildSummaryDto {
  id: string;
  slug: string;
  buildName: string;
  status: PublishStatus;
}

export interface BuildDetailDto {
  id: string;
  slug: string;
  buildName: string;
  shortDescription: string;
  philosophy: string;
  playstyle: string | null;
  skills: string[];
  recommendedFor: string[];
  avoidFor: string[];
  status: PublishStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  card: {
    id: string;
    slug: string;
    cardName: string;
    rarity: string | null;
    position: string;
    overall: number;
    player: { id: string; slug: string; name: string };
    variantBuilds: BuildSummaryDto[];
  };
  statistics: StatisticEntryDto[];
  keyAttributes: StatisticEntryDto[];
  strengths: string[];
  weaknesses: string[];
  feedback: FeedbackEntryDto[];
  media: MediaDto[];
}

export interface PlayerDto {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  cards: {
    id: string;
    slug: string;
    cardName: string;
    rarity: string | null;
    position: string;
    overall: number;
    builds: BuildSummaryDto[];
  }[];
}

export interface TutorialStepDto {
  text: string;
  order: number;
}

export interface TutorialDto {
  id: string;
  slug: string;
  title: string;
  category: TutorialCategory;
  description: string;
  content: string;
  difficulty: Difficulty;
  tips: string[];
  steps: TutorialStepDto[];
  status: PublishStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  media: MediaDto[];
}

export interface FormationRoleDto {
  position: string;
  description: string;
  order: number;
}

export interface FormationDto {
  id: string;
  slug: string;
  title: string;
  formation: string;
  playstyle: string;
  description: string;
  recommendedUsage: string;
  tacticalInstructions: string[];
  strengths: string[];
  weaknesses: string[];
  roles: FormationRoleDto[];
  status: PublishStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  media: MediaDto[];
}

export interface SocialLinkDto {
  platform: string;
  url: string;
  order: number;
}

export interface CoachDto {
  id: string;
  slug: string;
  name: string;
  bio: string;
  coachingDescription: string;
  specialties: string[];
  bookingEnabled: boolean;
  status: PublishStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  socialLinks: SocialLinkDto[];
  media: MediaDto[];
}

export interface DiscoveryDto {
  id: string;
  slug: string;
  title: string;
  category: DiscoveryCategory;
  excerpt: string;
  content: string;
  findings: string[];
  author: string;
  sources: string[];
  researchStatus: ResearchStatus;
  status: PublishStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  media: MediaDto[];
}

export interface FeaturedContentReferenceDto {
  contentType: FeaturedContentType;
  contentId: string;
  slug: string | null;
  title: string | null;
  status: PublishStatus | null;
}

export interface FeaturedEntryDto {
  id: string;
  contentType: FeaturedContentType;
  contentId: string;
  placement: "HERO" | "FEATURED" | "SIDEBAR" | "LATEST";
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  content: FeaturedContentReferenceDto | null;
}