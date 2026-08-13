import { checkIntegerRange, hasErrors, type EditorErrors } from "@/lib/content-editor/validation";
import {
  FEATURED_CONTENT_TYPE_OPTIONS,
  FEATURED_PLACEMENT_OPTIONS,
} from "@/lib/content-editor/labels";
import type { FeaturedEditorInput } from "@/lib/featured-editor/types";

const CONTENT_TYPES = new Set(FEATURED_CONTENT_TYPE_OPTIONS.map((o) => o.value));
const PLACEMENTS = new Set(FEATURED_PLACEMENT_OPTIONS.map((o) => o.value));

function validateFeaturedEditorInput(input: FeaturedEditorInput): EditorErrors {
  const errors: EditorErrors = {};

  if (!CONTENT_TYPES.has(input.contentType)) {
    errors.contentType = "Choose a content type.";
  }
  if (!input.contentId) {
    errors.contentId = "Choose the content to feature.";
  }
  if (!PLACEMENTS.has(input.placement)) {
    errors.placement = "Choose a placement.";
  }
  checkIntegerRange(errors, "order", String(input.order), 0, 99, "Order");

  return errors;
}

export function hasFeaturedErrors(errors: EditorErrors): boolean {
  return hasErrors(errors);
}

export { validateFeaturedEditorInput };