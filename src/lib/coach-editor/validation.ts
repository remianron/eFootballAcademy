import type { CoachEditorInput } from "@/lib/coach-editor/types";
import {
  checkMaxLength,
  checkPairList,
  checkRequired,
  checkSlug,
  checkStringList,
  checkUrlOptional,
  hasErrors,
  type EditorErrors,
} from "@/lib/content-editor/validation";
import { validateContentMedia } from "@/lib/content-editor/media-input";

function hasCoachErrors(errors: EditorErrors): boolean {
  return hasErrors(errors);
}

function validateCoachEditorInput(
  input: CoachEditorInput,
  opts: { requirePublishable: boolean }
): EditorErrors {
  const errors: EditorErrors = {};

  checkRequired(errors, "name", input.name, "Name");
  checkMaxLength(errors, "name", input.name, "Name", 100);
  checkSlug(errors, "slug", input.slug);
  checkRequired(errors, "bio", input.bio, "Bio", opts.requirePublishable);
  checkMaxLength(errors, "bio", input.bio, "Bio", 2000);
  checkRequired(
    errors,
    "coachingDescription",
    input.coachingDescription,
    "Coaching description",
    opts.requirePublishable
  );
  checkMaxLength(
    errors,
    "coachingDescription",
    input.coachingDescription,
    "Coaching description",
    2000
  );
  checkStringList(errors, "specialties", input.specialties, {
    max: 12,
    maxItemLength: 300,
    label: "Specialty",
  });
  checkPairList(
    errors,
    "socialLinks",
    input.socialLinks.map((link) => ({ first: link.platform, second: link.url })),
    {
      max: 8,
      maxFirstLength: 32,
      maxSecondLength: 255,
      labels: ["Platform", "URL"],
    }
  );
  input.socialLinks.forEach((link, index) => {
    checkUrlOptional(errors, `socialLinks.${index}.url`, link.url, "URL");
  });
  validateContentMedia(input.media, errors, "media");

  return errors;
}

export { hasCoachErrors, validateCoachEditorInput };