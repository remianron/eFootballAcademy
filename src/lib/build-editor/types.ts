import type { MediaKind, PublishStatus } from "@/generated/prisma/client";
import type { ContentBlockItem } from "@/lib/content-blocks/types";

export type BuildEditorStatus = Extract<PublishStatus, "DRAFT" | "PUBLISHED" | "ARCHIVED">;

export interface MediaFormItem {
  uid: string;
  kind: MediaKind;
  youtubeInput: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  caption: string;
  aspectRatio: string;
}

export interface BuildEditorFormState {
  playerName: string;
  playerSlug: string;
  playerSlugTouched: boolean;
  cardName: string;
  rarity: string;
  position: string;
  overall: string;
  buildName: string;
  buildSlug: string;
  buildSlugTouched: boolean;
  playstyle: string;
  shortDescription: string;
  philosophy: string;
  skills: string[];
  recommendedFor: string[];
  avoidFor: string[];
  statistics: Record<string, string>;
  keyAttributes: string[];
  strengths: string[];
  weaknesses: string[];
  screenshot: { url: string; alt: string; caption: string };
  media: MediaFormItem[];
  blocks: ContentBlockItem[];
}

export interface BuildEditorMediaInput {
  kind: MediaKind;
  youtubeInput: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  caption: string;
  aspectRatio: string;
}

export interface BuildEditorInput {
  playerName: string;
  playerSlug: string;
  cardName: string;
  rarity: string;
  position: string;
  overall: string;
  buildName: string;
  buildSlug: string;
  playstyle: string;
  shortDescription: string;
  philosophy: string;
  skills: string[];
  recommendedFor: string[];
  avoidFor: string[];
  statistics: Record<string, string>;
  keyAttributes: string[];
  strengths: string[];
  weaknesses: string[];
  screenshot: { url: string; alt: string; caption: string };
  media: BuildEditorMediaInput[];
  blocks: ContentBlockItem[];
  status: BuildEditorStatus;
}

export type EditorActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type EditorActionErrorsResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> };