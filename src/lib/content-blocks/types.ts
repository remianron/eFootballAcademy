import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { PairItem } from "@/components/admin/form/pair-list-editor";
import type { NormalizedContentMedia } from "@/lib/content-editor/media-input";

export const CONTENT_BLOCK_TYPES = [
  "heading",
  "text",
  "media",
  "attributes",
  "custom",
  "mixed",
  "quote",
  "divider",
  "spacer",
] as const;

export type ContentBlockType = (typeof CONTENT_BLOCK_TYPES)[number];

export const CONTENT_BLOCK_LABELS: Record<ContentBlockType, string> = {
  heading: "Heading",
  text: "Text",
  media: "Media (single or side-by-side)",
  attributes: "Custom attributes",
  custom: "Custom section",
  mixed: "Media + text side-by-side",
  quote: "Quote / callout",
  divider: "Divider",
  spacer: "Spacer",
};

/**
 * Editor-side block item. `uid` keeps identity stable while the admin
 * edits; it is never persisted.
 */
export type ContentBlockItem =
  | ({ uid: string; type: "heading" } & HeadingBlockData)
  | ({ uid: string; type: "text" } & TextBlockData)
  | ({ uid: string; type: "media" } & MediaBlockData)
  | ({ uid: string; type: "attributes" } & AttributesBlockData)
  | ({ uid: string; type: "custom" } & CustomBlockData)
  | ({ uid: string; type: "mixed" } & MixedBlockData)
  | ({ uid: string; type: "quote" } & QuoteBlockData)
  | ({ uid: string; type: "divider" })
  | ({ uid: string; type: "spacer" } & SpacerBlockData);

export interface HeadingBlockData {
  text: string;
  level: "2" | "3";
}

export interface TextBlockData {
  content: string;
}

export interface MediaBlockData {
  media: ContentMediaItem[];
}

export interface AttributesBlockData {
  items: PairItem[];
}

export interface CustomBlockData {
  label: string;
  content: string;
}

export interface MixedBlockData {
  media: ContentMediaItem[];
  content: string;
  side: "media" | "text";
}

export interface QuoteBlockData {
  text: string;
  attribution: string;
}

export interface SpacerBlockData {
  size: SpacerSize;
}

/**
 * Normalized block payload — what is actually persisted in `ContentBlock.data`.
 */
export type NormalizedContentBlock =
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "text"; content: string }
  | { type: "media"; media: NormalizedContentMedia[] }
  | { type: "attributes"; items: { name: string; value: string }[] }
  | { type: "custom"; label: string; content: string }
  | {
      type: "mixed";
      media: NormalizedContentMedia[];
      content: string;
      side: "media" | "text";
    }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "divider" }
  | { type: "spacer"; size: SpacerSize };

export const BLOCK_HEADING_LEVELS = ["2", "3"] as const;
export const MIXED_SIDES = ["media", "text"] as const;
export const SPACER_SIZES = ["sm", "md", "lg"] as const;
export type SpacerSize = (typeof SPACER_SIZES)[number];