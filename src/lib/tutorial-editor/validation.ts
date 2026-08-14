import type { Difficulty, TutorialCategory } from "@/generated/prisma/client";
import type { TutorialEditorInput } from "@/lib/tutorial-editor/types";
import {
  checkMaxLength,
  checkRequired,
  checkSlug,
  checkStringList,
  hasErrors,
  type EditorErrors,
} from "@/lib/content-editor/validation";
import { validateContentMedia } from "@/lib/content-editor/media-input";
import { validateContentBlocks } from "@/lib/content-blocks/validation";

const TUTORIAL_CATEGORIES: TutorialCategory[] = [
  "FREE_KICKS",
  "SKILLS",
  "DRIBBLING",
  "PASSING",
  "SHOOTING",
  "CORNERS",
  "MECHANICS",
];

const DIFFICULTIES: Difficulty[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export function validateTutorialEditorInput(
  input: TutorialEditorInput,
  opts: { requirePublishable?: boolean } = {}
): EditorErrors {
  const errors: EditorErrors = {};
  const publish = opts.requirePublishable ?? input.status === "PUBLISHED";
  const trim = (value: string) => value.trim();

  const title = trim(input.title);
  const slug = trim(input.slug);
  const description = trim(input.description);
  const content = trim(input.content);

  checkRequired(errors, "title", title, "Title");
  checkRequired(errors, "slug", slug, "Slug");
  checkSlug(errors, "slug", slug, "Slug");
  checkMaxLength(errors, "title", title, "Title", 255);

  if (!TUTORIAL_CATEGORIES.includes(input.category)) {
    errors.category = "Choose a category.";
  }
  if (!DIFFICULTIES.includes(input.difficulty)) {
    errors.difficulty = "Choose a difficulty.";
  }

  checkMaxLength(errors, "description", description, "Description", 2000);
  checkMaxLength(errors, "content", content, "Content", 20000);
  if (publish && !description) {
    errors.description = "Description is required before publishing.";
  }
  if (publish && !content) {
    errors.content = "Content is required before publishing.";
  }

  checkStringList(errors, "steps", input.steps, {
    max: 20,
    maxItemLength: 500,
    label: "Steps",
  });
  checkStringList(errors, "tips", input.tips, {
    max: 12,
    maxItemLength: 300,
    label: "Tips",
  });

  validateContentMedia(input.media, errors, "media");
  validateContentBlocks(input.blocks, errors, "blocks");

  return errors;
}

export function hasTutorialErrors(errors: EditorErrors): boolean {
  return hasErrors(errors);
}