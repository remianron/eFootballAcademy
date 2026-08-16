import {
  hasErrors,
  type EditorErrors,
} from "@/lib/content-editor/validation";
import type { SiteSocialLinkInput } from "@/lib/social-links/types";

const MAX_PLATFORM_LENGTH = 32;
const MAX_LABEL_LENGTH = 64;
const MAX_URL_LENGTH = 2048;
const MIN_SORT_ORDER = 1;
const MAX_SORT_ORDER = 99;

/**
 * Placeholder-only URLs like "#" are rejected: a link must carry a real
 * https:// destination before it can be saved (and therefore published).
 */
const SITE_SOCIAL_URL_PATTERN = /^https?:\/\/\S+$/;

export function validateSiteSocialLinkInput(
  input: SiteSocialLinkInput
): EditorErrors {
  const errors: EditorErrors = {};

  const platform = input.platform.trim();
  if (!platform) {
    errors.platform = "Platform is required.";
  } else if (platform.length > MAX_PLATFORM_LENGTH) {
    errors.platform = `Platform must be ${MAX_PLATFORM_LENGTH} characters or fewer.`;
  }

  const label = input.label.trim();
  if (!label) {
    errors.label = "Label is required.";
  } else if (label.length > MAX_LABEL_LENGTH) {
    errors.label = `Label must be ${MAX_LABEL_LENGTH} characters or fewer.`;
  }

  const url = input.url.trim();
  if (!url) {
    errors.url = "URL is required.";
  } else if (url.length > MAX_URL_LENGTH) {
    errors.url = `URL must be ${MAX_URL_LENGTH} characters or fewer.`;
  } else if (!SITE_SOCIAL_URL_PATTERN.test(url)) {
    errors.url =
      "Enter a valid https:// URL — placeholder links (like #) cannot be used.";
  }

  if (
    !Number.isInteger(input.sortOrder) ||
    input.sortOrder < MIN_SORT_ORDER ||
    input.sortOrder > MAX_SORT_ORDER
  ) {
    errors.sortOrder =
      `Use a whole number between ${MIN_SORT_ORDER} and ${MAX_SORT_ORDER}.`;
  }

  return errors;
}

export function hasSiteSocialLinkErrors(errors: EditorErrors): boolean {
  return hasErrors(errors);
}