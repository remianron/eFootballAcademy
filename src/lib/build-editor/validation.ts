import { extractYouTubeVideoId } from "@/lib/build-editor/youtube";
import { isSlugFormat } from "@/lib/build-editor/slug";
import type {
  BuildEditorInput,
  BuildEditorMediaInput,
} from "@/lib/build-editor/types";

export const STAT_MIN = 0;
export const STAT_MAX = 101;
export const OVERALL_MIN = 0;
export const OVERALL_MAX = 99;
export const ASPECT_RATIOS = ["16:9", "9:16", "1:1"] as const;

export type EditorErrors = Record<string, string>;

const URL_OR_PLACEHOLDER = /^(?:https?:\/\/\S+|#)$/;

export function isMediaItemEmpty(item: BuildEditorMediaInput): boolean {
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

export function hasEditorErrors(errors: EditorErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateBuildEditorInput(
  input: BuildEditorInput,
  opts: { requirePublishable?: boolean } = {}
): EditorErrors {
  const errors: EditorErrors = {};
  const publish = opts.requirePublishable ?? input.status === "PUBLISHED";
  const trim = (value: string) => value.trim();

  function required(field: string, value: string, label: string) {
    if (!value) errors[field] = `${label} is required.`;
  }

  function maxLength(field: string, value: string, label: string, max: number) {
    if (value.length > max) {
      errors[field] = `${label} must be ${max} characters or fewer.`;
    }
  }

  function slugField(field: string, value: string, label: string) {
    if (!value) return;
    if (!isSlugFormat(value)) {
      errors[field] = "Use lowercase letters, numbers and dashes only.";
    } else {
      maxLength(field, value, label, 80);
    }
  }

  const playerName = trim(input.playerName);
  const playerSlug = trim(input.playerSlug);
  const cardName = trim(input.cardName);
  const rarity = trim(input.rarity);
  const position = trim(input.position);
  const overall = trim(input.overall);
  const buildName = trim(input.buildName);
  const buildSlug = trim(input.buildSlug);
  const playstyle = trim(input.playstyle);

  required("playerName", playerName, "Player name");
  required("playerSlug", playerSlug, "Player slug");
  required("cardName", cardName, "Card name");
  required("buildName", buildName, "Build name");
  required("buildSlug", buildSlug, "Build slug");
  required("position", position, "Position");
  required("overall", overall, "Overall");

  slugField("playerSlug", playerSlug, "Player slug");
  slugField("buildSlug", buildSlug, "Build slug");
  maxLength("playerName", playerName, "Player name", 100);
  maxLength("cardName", cardName, "Card name", 100);
  maxLength("buildName", buildName, "Build name", 120);
  maxLength("position", position, "Position", 32);
  maxLength("playstyle", playstyle, "Playstyle", 60);
  maxLength("rarity", rarity, "Rarity", 30);

  if (overall && !/^\d+$/.test(overall)) {
    errors.overall = "Overall must be a whole number.";
  } else if (overall) {
    const value = Number(overall);
    if (value < OVERALL_MIN || value > OVERALL_MAX) {
      errors.overall = `Use a value between ${OVERALL_MIN} and ${OVERALL_MAX}.`;
    }
  }

  const shortDescription = trim(input.shortDescription);
  const philosophy = trim(input.philosophy);
  maxLength("shortDescription", shortDescription, "Short description", 500);
  maxLength("philosophy", philosophy, "Philosophy", 5000);
  if (publish && !shortDescription) {
    errors.shortDescription = "Short description is required before publishing.";
  }
  if (publish && !philosophy) {
    errors.philosophy = "Philosophy is required before publishing.";
  }

  function validateList(
    field: string,
    items: string[],
    label: string,
    max: number,
    maxItemLength: number
  ) {
    const trimmed = items.map(trim);
    if (trimmed.length > max) {
      errors[field] = `At most ${max} items allowed.`;
    }
    for (let i = 0; i < trimmed.length; i++) {
      if (!trimmed[i]) {
        errors[`${field}.${i}`] = "Remove empty entries.";
      } else if (trimmed[i].length > maxItemLength) {
        errors[`${field}.${i}`] = `Keep it under ${maxItemLength} characters.`;
      }
    }
  }

  validateList("skills", input.skills, "Skills", 12, 120);
  validateList("recommendedFor", input.recommendedFor, "Recommended for", 10, 160);
  validateList("avoidFor", input.avoidFor, "Avoid for", 10, 160);
  validateList("strengths", input.strengths, "Strengths", 10, 160);
  validateList("weaknesses", input.weaknesses, "Weaknesses", 10, 160);

  const populatedKeys = new Set(
    Object.keys(input.statistics).filter(
      (key) => trim(input.statistics[key] ?? "") !== ""
    )
  );

  for (const key of Object.keys(input.statistics)) {
    const value = trim(input.statistics[key] ?? "");
    if (!value) continue;
    if (!/^\d+$/.test(value)) {
      errors[`statistics.${key}`] = "Enter a whole number.";
    } else {
      const number = Number(value);
      if (number < STAT_MIN || number > STAT_MAX) {
        errors[`statistics.${key}`] = `Use a value between ${STAT_MIN} and ${STAT_MAX}.`;
      }
    }
  }

  const seenKeys = new Set<string>();
  for (let i = 0; i < input.keyAttributes.length; i++) {
    const key = input.keyAttributes[i];
    if (!populatedKeys.has(key)) {
      errors[`keyAttributes.${i}`] =
        "Only attributes with a value can be key attributes.";
    } else if (seenKeys.has(key)) {
      errors[`keyAttributes.${i}`] = "Remove the duplicate.";
    }
    seenKeys.add(key);
  }

  const screenshotUrl = trim(input.screenshot.url);
  maxLength("screenshot.url", screenshotUrl, "Image URL", 500);
  if (screenshotUrl && !URL_OR_PLACEHOLDER.test(screenshotUrl)) {
    errors["screenshot.url"] = "Use an https:// URL or leave empty.";
  }
  maxLength("screenshot.alt", trim(input.screenshot.alt), "Alt text", 200);
  maxLength("screenshot.caption", trim(input.screenshot.caption), "Caption", 300);

  const media = input.media.filter((item) => !isMediaItemEmpty(item));
  if (media.length > 20) {
    errors.media = "At most 20 media items allowed.";
  }
  for (let i = 0; i < media.length; i++) {
    const item = media[i];
    const prefix = `media.${i}`;
    if (item.kind === "YOUTUBE_VIDEO") {
      if (!extractYouTubeVideoId(item.youtubeInput)) {
        errors[`${prefix}.youtube`] =
          "Paste a YouTube URL or 11-character video ID.";
      }
    } else {
      const url = trim(item.url);
      if (!url) {
        errors[`${prefix}.url`] = "Image URL is required.";
      } else if (!URL_OR_PLACEHOLDER.test(url)) {
        errors[`${prefix}.url`] = "Use an https:// URL or leave empty.";
      }
    }
    if (!ASPECT_RATIOS.includes(item.aspectRatio as (typeof ASPECT_RATIOS)[number])) {
      errors[`${prefix}.aspectRatio`] = "Choose an aspect ratio.";
    }
    const thumbnailUrl = trim(item.thumbnailUrl);
    if (thumbnailUrl && !URL_OR_PLACEHOLDER.test(thumbnailUrl)) {
      errors[`${prefix}.thumbnail`] = "Use an https:// URL or leave empty.";
    }
    maxLength(`${prefix}.alt`, trim(item.alt), "Alt text", 200);
    maxLength(`${prefix}.caption`, trim(item.caption), "Caption", 300);
  }

  return errors;
}