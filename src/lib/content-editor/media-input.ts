import { extractYouTubeVideoId } from "@/lib/build-editor/youtube";
import type { MediaKind } from "@/generated/prisma/client";

export const CONTENT_ASPECT_RATIOS = ["16:9", "9:16", "1:1"] as const;
export const URL_OR_PLACEHOLDER = /^(?:https?:\/\/\S+|#)$/;

export interface ContentMediaInput {
  kind: MediaKind;
  youtubeInput: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  caption: string;
  aspectRatio: string;
}

export function isContentMediaEmpty(item: ContentMediaInput): boolean {
  const fieldsEmpty =
    item.url.trim() === "" &&
    item.thumbnailUrl.trim() === "" &&
    item.alt.trim() === "" &&
    item.caption.trim() === "";
  if (item.kind === "YOUTUBE_VIDEO") {
    return fieldsEmpty && item.youtubeInput.trim() === "";
  }
  return fieldsEmpty;
}

export function validateContentMedia(
  inputs: ContentMediaInput[],
  errors: Record<string, string>,
  prefix = "media",
  maxItems = 20
): void {
  const media = inputs.filter((item) => !isContentMediaEmpty(item));
  if (media.length > maxItems) {
    errors[prefix] = `At most ${maxItems} media items allowed.`;
  }
  for (let i = 0; i < media.length; i++) {
    const item = media[i];
    const field = `${prefix}.${i}`;
    if (item.kind === "YOUTUBE_VIDEO") {
      if (!extractYouTubeVideoId(item.youtubeInput)) {
        errors[`${field}.youtube`] =
          "Paste a YouTube URL or 11-character video ID.";
      }
    } else {
      const url = item.url.trim();
      if (!url) {
        errors[`${field}.url`] = "Image URL is required.";
      } else if (!URL_OR_PLACEHOLDER.test(url)) {
        errors[`${field}.url`] = "Use an https:// URL or leave empty.";
      }
    }
    if (!CONTENT_ASPECT_RATIOS.includes(item.aspectRatio as (typeof CONTENT_ASPECT_RATIOS)[number])) {
      errors[`${field}.aspectRatio`] = "Choose an aspect ratio.";
    }
    const thumbnailUrl = item.thumbnailUrl.trim();
    if (thumbnailUrl && !URL_OR_PLACEHOLDER.test(thumbnailUrl)) {
      errors[`${field}.thumbnail`] = "Use an https:// URL or leave empty.";
    }
    if (item.alt.trim().length > 200) {
      errors[`${field}.alt`] = "Alt text must be 200 characters or fewer.";
    }
    if (item.caption.trim().length > 300) {
      errors[`${field}.caption`] = "Caption must be 300 characters or fewer.";
    }
  }
}

export interface NormalizedContentMedia {
  kind: MediaKind;
  youtubeVideoId: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  alt: string;
  caption: string;
  aspectRatio: string;
}

export function normalizeContentMedia(
  inputs: ContentMediaInput[]
): NormalizedContentMedia[] {
  const trim = (value: string) => value.trim();
  return inputs
    .filter((item) => !isContentMediaEmpty(item))
    .map((item): NormalizedContentMedia => {
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