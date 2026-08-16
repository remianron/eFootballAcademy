import type {
  BookingStatus,
  ContactMethod,
  DiscoveryCategory,
  Difficulty,
  FeaturedContentType,
  FeedbackPlatform,
  MediaKind,
  MediaOwnerType,
  PublishStatus,
  ResearchStatus,
  SessionStatus,
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

/**
 * Ordered editorial content blocks (flexible CMS). `data` mirrors the
 * normalized payload stored in ContentBlock.data:
 *   heading    -> { type, text, level: 2 | 3 }
 *   text       -> { type, content }
 *   media      -> { type, media: NormalizedContentMedia[] }
 *   attributes -> { type, items: { name, value }[] }
 *   custom     -> { type, label?, content }
 *   mixed      -> { type, media, content, side: "media" | "text" }
 *   quote      -> { type, text, attribution? }
 *   divider    -> { type }
 *   spacer     -> { type, size: "sm" | "md" | "lg" }
 */
export type ContentBlockDto =
  | ({ id: string; order: number } & NormalizedHeadingBlock)
  | ({ id: string; order: number } & NormalizedTextBlock)
  | ({ id: string; order: number } & NormalizedMediaBlock)
  | ({ id: string; order: number } & NormalizedAttributesBlock)
  | ({ id: string; order: number } & NormalizedCustomBlock)
  | ({ id: string; order: number } & NormalizedMixedBlock)
  | ({ id: string; order: number } & NormalizedQuoteBlock)
  | ({ id: string; order: number } & NormalizedDividerBlock)
  | ({ id: string; order: number } & NormalizedSpacerBlock);

interface NormalizedHeadingBlock {
  type: "heading";
  text: string;
  level: 2 | 3;
}

interface NormalizedTextBlock {
  type: "text";
  content: string;
}

interface NormalizedMediaBlock {
  type: "media";
  media: NormalizedMediaEntry[];
}

interface NormalizedMixedBlock {
  type: "mixed";
  media: NormalizedMediaEntry[];
  content: string;
  side: "media" | "text";
}

interface NormalizedQuoteBlock {
  type: "quote";
  text: string;
  attribution?: string;
}

interface NormalizedDividerBlock {
  type: "divider";
}

interface NormalizedSpacerBlock {
  type: "spacer";
  size: "sm" | "md" | "lg";
}

interface NormalizedMediaEntry {
  kind: MediaKind;
  youtubeVideoId: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  alt: string;
  caption: string;
  aspectRatio: string;
}

interface NormalizedAttributesBlock {
  type: "attributes";
  items: { name: string; value: string }[];
}

interface NormalizedCustomBlock {
  type: "custom";
  label: string;
  content: string;
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
  blocks: ContentBlockDto[];
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
  blocks: ContentBlockDto[];
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
  blocks: ContentBlockDto[];
}

export interface SocialLinkDto {
  platform: string;
  url: string;
  order: number;
}

/**
 * Global site social link (footer + floating widget). Only `published`
 * rows are ever exposed through the public DTO/API — the public mapper
 * additionally strips every field except platform/label/url.
 */
export interface SiteSocialLinkDto {
  id: string;
  platform: string;
  label: string;
  url: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
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
  blocks: ContentBlockDto[];
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
  blocks: ContentBlockDto[];
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

export interface BookingDto {
  id: string;
  coachId: string;
  coachName: string;
  coachSlug: string;
  name: string;
  email: string;
  phone: string | null;
  contactMethod: ContactMethod | null;
  message: string;
  status: BookingStatus;
  session: SessionDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDto {
  id: string;
  bookingRequestId: string;
  coachId: string;
  coachName: string;
  coachSlug: string;
  requesterName: string;
  requesterEmail: string;
  scheduledAt: string; // ISO 8601
  durationMinutes: number;
  status: SessionStatus;
  priceAmount: string | null; // decimal string ("25.50") — informational only
  currency: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
