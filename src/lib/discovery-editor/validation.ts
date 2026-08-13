import type { DiscoveryEditorInput } from "@/lib/discovery-editor/types";
import {
  checkMaxLength,
  checkRequired,
  checkSlug,
  checkStringList,
  hasErrors,
  type EditorErrors,
} from "@/lib/content-editor/validation";
import { validateContentMedia } from "@/lib/content-editor/media-input";

function hasDiscoveryErrors(errors: EditorErrors): boolean {
  return hasErrors(errors);
}

function validateDiscoveryEditorInput(
  input: DiscoveryEditorInput,
  opts: { requirePublishable: boolean }
): EditorErrors {
  const errors: EditorErrors = {};

  checkRequired(errors, "title", input.title, "Title");
  checkMaxLength(errors, "title", input.title, "Title", 255);
  checkSlug(errors, "slug", input.slug);
  checkRequired(errors, "category", input.category, "Category", opts.requirePublishable);
  checkRequired(errors, "author", input.author, "Author", opts.requirePublishable);
  checkMaxLength(errors, "author", input.author, "Author", 100);
  checkRequired(errors, "excerpt", input.excerpt, "Excerpt", opts.requirePublishable);
  checkMaxLength(errors, "excerpt", input.excerpt, "Excerpt", 2000);
  checkRequired(errors, "content", input.content, "Content", opts.requirePublishable);
  checkMaxLength(errors, "content", input.content, "Content", 20000);
  checkRequired(
    errors,
    "researchStatus",
    input.researchStatus,
    "Research status",
    opts.requirePublishable
  );
  checkStringList(errors, "findings", input.findings, {
    max: 12,
    maxItemLength: 500,
    label: "Finding",
  });
  checkStringList(errors, "sources", input.sources, {
    max: 12,
    maxItemLength: 300,
    label: "Source",
  });
  validateContentMedia(input.media, errors, "media");

  return errors;
}

export { hasDiscoveryErrors, validateDiscoveryEditorInput };