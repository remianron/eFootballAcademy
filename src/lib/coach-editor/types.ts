import type { PublishStatus } from "@/generated/prisma/client";
import type { PairItem } from "@/components/admin/form/pair-list-editor";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { ContentMediaInput } from "@/lib/content-editor/media-input";
import type { ContentBlockItem } from "@/lib/content-blocks/types";

export type CoachEditorStatus = Extract<PublishStatus, "DRAFT" | "PUBLISHED">;

export interface CoachEditorFormState {
  name: string;
  slug: string;
  slugTouched: boolean;
  bio: string;
  coachingDescription: string;
  specialties: string[];
  bookingEnabled: boolean;
  socialLinks: PairItem[];
  media: ContentMediaItem[];
  blocks: ContentBlockItem[];
}

export interface CoachEditorInput {
  name: string;
  slug: string;
  bio: string;
  coachingDescription: string;
  specialties: string[];
  bookingEnabled: boolean;
  socialLinks: { platform: string; url: string }[];
  media: ContentMediaInput[];
  blocks: ContentBlockItem[];
  status: CoachEditorStatus;
}