import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { PairItem } from "@/components/admin/form/pair-list-editor";
import type { NormalizedContentMedia } from "@/lib/content-editor/media-input";
import type {
  ContentBlockItem,
  NormalizedContentBlock,
} from "@/lib/content-blocks/types";
import type { ContentBlockDto } from "@/lib/db/types";

/**
 * Editor form state for a block list. Kept in a separate module so the
 * five content-type transforms share one implementation.
 */
export function contentBlockItemsFromDto(
  blocks: ContentBlockDto[]
): ContentBlockItem[] {
  return blocks.map((block) => contentBlockItemFromPayload(block));
}

export function contentBlockItemFromPayload(
  payload: NormalizedContentBlock & { id?: string; order?: number }
): ContentBlockItem {
  const uid = payload.id ?? localUid();
  switch (payload.type) {
    case "heading":
      return { uid, type: "heading", text: payload.text, level: payload.level === 3 ? "3" : "2" };
    case "text":
      return { uid, type: "text", content: payload.content };
    case "media":
      return {
        uid,
        type: "media",
        media: mediaItemsFromPayload(payload.media),
      };
    case "attributes":
      return {
        uid,
        type: "attributes",
        items: payload.items.map(
          (item): PairItem => ({ first: item.name, second: item.value })
        ),
      };
    case "custom":
      return { uid, type: "custom", label: payload.label, content: payload.content };
    case "mixed":
      return {
        uid,
        type: "mixed",
        media: mediaItemsFromPayload(payload.media),
        content: payload.content,
        side: payload.side,
      };
    case "quote":
      return {
        uid,
        type: "quote",
        text: payload.text,
        attribution: payload.attribution ?? "",
      };
    case "divider":
      return { uid, type: "divider" };
    case "spacer":
      return { uid, type: "spacer", size: payload.size ?? "md" };
  }
}

function mediaItemsFromPayload(media: NormalizedContentMedia[]): ContentMediaItem[] {
  return media.map(
    (item): ContentMediaItem => ({
      uid: localUid(),
      kind: item.kind,
      youtubeInput: item.youtubeVideoId ?? "",
      url: item.url ?? "",
      thumbnailUrl: item.thumbnailUrl ?? "",
      alt: item.alt,
      caption: item.caption,
      aspectRatio: item.aspectRatio,
    })
  );
}

function localUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}