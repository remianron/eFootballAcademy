import type { FormationEditorInput } from "@/lib/formation-editor/types";
import {
  checkMaxLength,
  checkPairList,
  checkRequired,
  checkSlug,
  checkStringList,
  hasErrors,
  type EditorErrors,
} from "@/lib/content-editor/validation";
import { validateContentMedia } from "@/lib/content-editor/media-input";
import { validateContentBlocks } from "@/lib/content-blocks/validation";

function hasFormationErrors(errors: EditorErrors): boolean {
  return hasErrors(errors);
}

function validateFormationEditorInput(
  input: FormationEditorInput,
  opts: { requirePublishable: boolean }
): EditorErrors {
  const errors: EditorErrors = {};

  checkRequired(errors, "title", input.title, "Title");
  checkMaxLength(errors, "title", input.title, "Title", 255);
  checkSlug(errors, "slug", input.slug);
  checkRequired(errors, "formation", input.formation, "Formation", opts.requirePublishable);
  checkMaxLength(errors, "formation", input.formation, "Formation", 16);
  checkRequired(errors, "playstyle", input.playstyle, "Playstyle", opts.requirePublishable);
  checkMaxLength(errors, "playstyle", input.playstyle, "Playstyle", 50);
  checkRequired(errors, "description", input.description, "Description", opts.requirePublishable);
  checkMaxLength(errors, "description", input.description, "Description", 2000);
  checkRequired(errors, "recommendedUsage", input.recommendedUsage, "Recommended usage", opts.requirePublishable);
  checkMaxLength(errors, "recommendedUsage", input.recommendedUsage, "Recommended usage", 2000);
  checkStringList(errors, "tacticalInstructions", input.tacticalInstructions, {
    max: 10,
    maxItemLength: 300,
    label: "Tactical instruction",
  });
  checkStringList(errors, "strengths", input.strengths, {
    max: 10,
    maxItemLength: 300,
    label: "Strength",
  });
  checkStringList(errors, "weaknesses", input.weaknesses, {
    max: 10,
    maxItemLength: 300,
    label: "Weakness",
  });
  checkPairList(
    errors,
    "roles",
    input.roles.map((role) => ({ first: role.position, second: role.description })),
    {
      max: 12,
      maxFirstLength: 10,
      maxSecondLength: 500,
      labels: ["Position", "Role description"],
    }
  );
  validateContentMedia(input.media, errors, "media");
  validateContentBlocks(input.blocks, errors, "blocks");

  return errors;
}

export { hasFormationErrors, validateFormationEditorInput };