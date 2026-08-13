import type { FeaturedEntryDto } from "@/lib/db/types";
import type { FeaturedEditorFormState } from "@/lib/featured-editor/types";

export function emptyFeaturedFormState(): FeaturedEditorFormState {
  return {
    contentType: "",
    contentId: "",
    placement: "",
    order: "0",
    active: true,
  };
}

export function featuredFormStateFromDto(
  entry: FeaturedEntryDto
): FeaturedEditorFormState {
  return {
    contentType: entry.contentType,
    contentId: entry.contentId,
    placement: entry.placement,
    order: String(entry.order),
    active: entry.active,
  };
}