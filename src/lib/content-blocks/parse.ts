import type { ContentBlockDto } from "@/lib/db/types";
import type { MediaKind } from "@/generated/prisma/client";
import type { NormalizedContentMedia } from "@/lib/content-editor/media-input";
import type { NormalizedContentBlock } from "@/lib/content-blocks/types";
import { CONTENT_BLOCK_TYPES, type ContentBlockType } from "@/lib/content-blocks/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const asMediaList = (
  value: unknown
): NormalizedContentMedia[] | null => {
  if (!Array.isArray(value) || value.length === 0) return null;
  const media = value.map((item): NormalizedContentMedia | null => {
    if (!isRecord(item)) return null;
    const kind = asString(item.kind);
    if (kind !== "YOUTUBE_VIDEO" && kind !== "IMAGE" && kind !== "GIF") return null;
    const aspectRatio = asString(item.aspectRatio) ?? "16:9";
    if (kind === "YOUTUBE_VIDEO") {
      return {
        kind: kind as MediaKind,
        youtubeVideoId: asString(item.youtubeVideoId),
        url: null,
        thumbnailUrl: asString(item.thumbnailUrl),
        alt: asString(item.alt) ?? "",
        caption: asString(item.caption) ?? "",
        aspectRatio,
      };
    }
    return {
      kind: kind as MediaKind,
      youtubeVideoId: null,
      url: asString(item.url),
      thumbnailUrl: asString(item.thumbnailUrl),
      alt: asString(item.alt) ?? "",
      caption: asString(item.caption) ?? "",
      aspectRatio,
    };
  });
  if (media.some((item) => item === null)) return null;
  return media as NormalizedContentMedia[];
};

const asAttributeItems = (value: unknown): { name: string; value: string }[] | null => {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => {
    if (!isRecord(item)) return null;
    const name = asString(item.name);
    const fieldValue = asString(item.value);
    if (name === null || fieldValue === null) return null;
    return { name, value: fieldValue };
  });
  if (items.some((item) => item === null)) return null;
  return items as { name: string; value: string }[];
};

/**
 * Parses the raw JSON payload of a ContentBlock row into a typed,
 * validated payload. Invalid/malformed rows are dropped defensively so
 * a bad row can never crash a public page.
 */
export function parseContentBlockData(
  type: string,
  data: unknown
): NormalizedContentBlock | null {
  if (!CONTENT_BLOCK_TYPES.includes(type as ContentBlockType)) return null;
  if (!isRecord(data)) return null;

  switch (type as ContentBlockType) {
    case "heading": {
      const text = asString(data.text);
      if (text === null || !text.trim()) return null;
      const level = data.level === 3 || data.level === "3" ? 3 : 2;
      return { type: "heading", text: text.trim(), level };
    }
    case "text": {
      const content = asString(data.content);
      if (content === null || !content.trim()) return null;
      return { type: "text", content: content.trim() };
    }
    case "media": {
      const media = asMediaList(data.media);
      if (media === null) return null;
      return { type: "media", media };
    }
    case "attributes": {
      const items = asAttributeItems(data.items);
      if (items === null || items.length === 0) return null;
      return { type: "attributes", items };
    }
    case "custom": {
      const content = asString(data.content);
      const label = asString(data.label) ?? "";
      if (content === null || (!content.trim() && !label.trim())) return null;
      return { type: "custom", label: label.trim(), content: content.trim() };
    }
    case "mixed": {
      const media = asMediaList(data.media);
      const content = asString(data.content);
      if (media === null || content === null || !content.trim()) return null;
      return {
        type: "mixed",
        media,
        content: content.trim(),
        side: data.side === "text" ? "text" : "media",
      };
    }
    case "quote": {
      const text = asString(data.text);
      if (text === null || !text.trim()) return null;
      const attribution = (asString(data.attribution) ?? "").trim();
      return {
        type: "quote",
        text: text.trim(),
        ...(attribution ? { attribution } : {}),
      };
    }
    case "divider":
      return { type: "divider" };
    case "spacer": {
      const size = asString(data.size);
      return {
        type: "spacer",
        size: size === "sm" || size === "lg" ? size : "md",
      };
    }
  }
}

export function toContentBlockDto(
  row: { id: string; type: string; data: unknown; order: number }
): ContentBlockDto | null {
  const payload = parseContentBlockData(row.type, row.data);
  if (!payload) return null;
  return { ...payload, id: row.id, order: row.order };
}