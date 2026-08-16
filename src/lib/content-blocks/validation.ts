import { extractYouTubeVideoId } from "@/lib/build-editor/youtube";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { NormalizedContentMedia } from "@/lib/content-editor/media-input";
import type {
  ContentBlockItem,
  ContentBlockType,
  NormalizedContentBlock,
} from "@/lib/content-blocks/types";
import { MIXED_SIDES, SPACER_SIZES } from "@/lib/content-blocks/types";
import { validateContentMedia } from "@/lib/content-editor/media-input";
import type { EditorErrors } from "@/lib/content-editor/validation";

const MAX_BLOCKS = 50;
const MAX_HEADING_TEXT = 200;
const MAX_TEXT_CONTENT = 20000;
const MAX_LABEL_LENGTH = 80;
const MAX_ATTRIBUTES = 12;
const MAX_ATTRIBUTE_NAME = 100;
const MAX_ATTRIBUTE_VALUE = 500;
const MAX_MEDIA_PER_BLOCK = 4;
const MAX_MIXED_MEDIA = 2;
const MAX_QUOTE_TEXT = 1000;
const MAX_QUOTE_ATTRIBUTION = 80;

/**
 * Validates the full block list. Errors are keyed `blocks.${i}.<field>`
 * so the editor can map them onto each block.
 */
export function validateContentBlocks(
  blocks: ContentBlockItem[],
  errors: EditorErrors,
  prefix = "blocks"
): void {
  if (blocks.length > MAX_BLOCKS) {
    errors[prefix] = `At most ${MAX_BLOCKS} content blocks allowed.`;
  }
  blocks.forEach((block, index) => {
    const field = `${prefix}.${index}`;
    switch (block.type) {
      case "heading":
        validateHeading(block.text, field, errors);
        if (!["2", "3"].includes(block.level)) {
          errors[`${field}.level`] = "Choose a heading level.";
        }
        break;
      case "text":
        validateText(block.content, field, errors);
        break;
      case "media":
        validateContentMedia(block.media, errors, `${field}.media`, MAX_MEDIA_PER_BLOCK);
        break;
      case "attributes":
        validateAttributes(block.items, field, errors);
        break;
      case "custom":
        validateCustom(block.label, block.content, field, errors);
        break;
      case "mixed":
        validateMixed(block.media, block.content, block.side, field, errors);
        break;
      case "quote":
        validateQuote(block.text, block.attribution, field, errors);
        break;
      case "divider":
        break;
      case "spacer":
        if (!SPACER_SIZES.includes(block.size)) {
          errors[`${field}.size`] = "Choose a spacer size.";
        }
        break;
    }
  });
}

function validateHeading(text: string, field: string, errors: EditorErrors) {
  const trimmed = text.trim();
  if (!trimmed) {
    errors[`${field}.text`] = "Heading text is required.";
  } else if (trimmed.length > MAX_HEADING_TEXT) {
    errors[`${field}.text`] = `Keep the heading under ${MAX_HEADING_TEXT} characters.`;
  }
}

function validateText(content: string, field: string, errors: EditorErrors) {
  const trimmed = content.trim();
  if (!trimmed) {
    errors[`${field}.content`] = "Write some text for this block.";
  } else if (trimmed.length > MAX_TEXT_CONTENT) {
    errors[`${field}.content`] = `Keep the text under ${MAX_TEXT_CONTENT} characters.`;
  }
}

function validateAttributes(
  items: { first: string; second: string }[],
  field: string,
  errors: EditorErrors
) {
  const trimmed = items.map((item) => ({
    first: item.first.trim(),
    second: item.second.trim(),
  }));
  if (trimmed.length > MAX_ATTRIBUTES) {
    errors[`${field}.items`] = `At most ${MAX_ATTRIBUTES} attributes allowed.`;
  }
  for (let i = 0; i < trimmed.length; i++) {
    const item = trimmed[i];
    if (!item.first || !item.second) {
      errors[`${field}.items.${i}`] = "Fill in both the name and the value.";
    } else if (item.first.length > MAX_ATTRIBUTE_NAME) {
      errors[`${field}.items.${i}`] =
        `Attribute name must be ${MAX_ATTRIBUTE_NAME} characters or fewer.`;
    } else if (item.second.length > MAX_ATTRIBUTE_VALUE) {
      errors[`${field}.items.${i}`] =
        `Attribute value must be ${MAX_ATTRIBUTE_VALUE} characters or fewer.`;
    }
  }
}

function validateCustom(
  label: string,
  content: string,
  field: string,
  errors: EditorErrors
) {
  if (label.trim().length > MAX_LABEL_LENGTH) {
    errors[`${field}.label`] = `Keep the label under ${MAX_LABEL_LENGTH} characters.`;
  }
  const trimmed = content.trim();
  if (!trimmed) {
    errors[`${field}.content`] = "Write some content for this section.";
  } else if (trimmed.length > MAX_TEXT_CONTENT) {
    errors[`${field}.content`] = `Keep the content under ${MAX_TEXT_CONTENT} characters.`;
  }
}

function validateMixed(
  media: Parameters<typeof validateContentMedia>[0],
  content: string,
  side: string,
  field: string,
  errors: EditorErrors
) {
  validateContentMedia(media, errors, `${field}.media`, MAX_MIXED_MEDIA);
  const trimmed = content.trim();
  if (!trimmed) {
    errors[`${field}.content`] = "Write some text for this block.";
  } else if (trimmed.length > MAX_TEXT_CONTENT) {
    errors[`${field}.content`] = `Keep the text under ${MAX_TEXT_CONTENT} characters.`;
  }
  if (!MIXED_SIDES.includes(side as (typeof MIXED_SIDES)[number])) {
    errors[`${field}.side`] = "Choose which side comes first.";
  }
}

function validateQuote(
  text: string,
  attribution: string,
  field: string,
  errors: EditorErrors
) {
  const trimmed = text.trim();
  if (!trimmed) {
    errors[`${field}.text`] = "Write the quote or callout text.";
  } else if (trimmed.length > MAX_QUOTE_TEXT) {
    errors[`${field}.text`] = `Keep the quote under ${MAX_QUOTE_TEXT} characters.`;
  }
  if (attribution.trim().length > MAX_QUOTE_ATTRIBUTION) {
    errors[`${field}.attribution`] =
      `Keep the attribution under ${MAX_QUOTE_ATTRIBUTION} characters.`;
  }
}

export type { ContentBlockType };

export function emptyBlockOfType(type: ContentBlockType): ContentBlockItem {
  const uid = localUid();
  switch (type) {
    case "heading":
      return { uid, type, text: "", level: "2" };
    case "text":
      return { uid, type, content: "" };
    case "media":
      return { uid, type, media: [] };
    case "attributes":
      return { uid, type, items: [] };
    case "custom":
      return { uid, type, label: "", content: "" };
    case "mixed":
      return { uid, type, media: [], content: "", side: "media" };
    case "quote":
      return { uid, type, text: "", attribution: "" };
    case "divider":
      return { uid, type: "divider" };
    case "spacer":
      return { uid, type, size: "md" };
  }
}

export function normalizeContentBlocks(
  blocks: ContentBlockItem[]
): NormalizedContentBlock[] {
  const trim = (value: string) => value.trim();
  const result: NormalizedContentBlock[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "heading": {
        const text = trim(block.text);
        if (!text) continue;
        result.push({
          type: "heading",
          text,
          level: block.level === "3" ? 3 : 2,
        });
        break;
      }
      case "text": {
        const content = trim(block.content);
        if (!content) continue;
        result.push({ type: "text", content });
        break;
      }
      case "media": {
        const media = normalizeMediaItems(block.media);
        if (media.length === 0) continue;
        result.push({ type: "media", media });
        break;
      }
      case "attributes": {
        const items = block.items
          .map((item) => ({ name: trim(item.first), value: trim(item.second) }))
          .filter((item) => Boolean(item.name) && Boolean(item.value));
        if (items.length === 0) continue;
        result.push({ type: "attributes", items });
        break;
      }
      case "custom": {
        const content = trim(block.content);
        const label = trim(block.label);
        if (!content && !label) continue;
        result.push({ type: "custom", label, content });
        break;
      }
      case "mixed": {
        const content = trim(block.content);
        const media = normalizeMediaItems(block.media);
        if (!content || media.length === 0) continue;
        result.push({
          type: "mixed",
          media,
          content,
          side: block.side === "text" ? "text" : "media",
        });
        break;
      }
      case "quote": {
        const text = trim(block.text);
        if (!text) continue;
        const attribution = trim(block.attribution);
        result.push({
          type: "quote",
          text,
          ...(attribution ? { attribution } : {}),
        });
        break;
      }
      case "divider":
        result.push({ type: "divider" });
        break;
      case "spacer": {
        const size = SPACER_SIZES.includes(block.size) ? block.size : "md";
        result.push({ type: "spacer", size });
        break;
      }
    }
  }

  return result;
}

function normalizeMediaItems(
  items: ContentMediaItem[]
): NormalizedContentMedia[] {
  const trim = (value: string) => value.trim();
  return items
    .filter(
      (item) =>
        !(
          item.url.trim() === "" &&
          item.thumbnailUrl.trim() === "" &&
          item.alt.trim() === "" &&
          item.caption.trim() === "" &&
          (item.kind !== "YOUTUBE_VIDEO" || item.youtubeInput.trim() === "")
        )
    )
    .map((item) => {
      if (item.kind === "YOUTUBE_VIDEO") {
        return {
          kind: item.kind,
          youtubeVideoId: extractYouTubeVideoId(item.youtubeInput),
          url: null,
          thumbnailUrl: item.thumbnailUrl.trim() || null,
          alt: trim(item.alt),
          caption: trim(item.caption),
          aspectRatio: item.aspectRatio,
        };
      }
      return {
        kind: item.kind,
        youtubeVideoId: null,
        url: item.url.trim() || null,
        thumbnailUrl: item.thumbnailUrl.trim() || null,
        alt: trim(item.alt),
        caption: trim(item.caption),
        aspectRatio: item.aspectRatio,
      };
    });
}

function localUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}