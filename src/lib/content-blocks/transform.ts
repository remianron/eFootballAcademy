import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { PairItem } from "@/components/admin/form/pair-list-editor";
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
        media: payload.media.map(
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
        ),
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
  }
}

function localUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}