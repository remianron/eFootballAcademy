import type { TutorialDto } from "@/lib/db/types";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import { contentBlockItemsFromDto } from "@/lib/content-blocks/transform";
import type { TutorialEditorFormState } from "@/lib/tutorial-editor/types";

export function emptyTutorialFormState(): TutorialEditorFormState {
  return {
    title: "",
    slug: "",
    slugTouched: false,
    category: "",
    difficulty: "",
    description: "",
    content: "",
    steps: [],
    tips: [],
    media: [],
    blocks: [],
  };
}

export function tutorialFormStateFromDto(
  tutorial: TutorialDto
): TutorialEditorFormState {
  return {
    title: tutorial.title,
    slug: tutorial.slug,
    slugTouched: true,
    category: tutorial.category,
    difficulty: tutorial.difficulty,
    description: tutorial.description,
    content: tutorial.content,
    steps: tutorial.steps.map((step) => step.text),
    tips: tutorial.tips,
    media: tutorial.media.map(
      (item): ContentMediaItem => ({
        uid: item.id,
        kind: item.kind,
        youtubeInput: item.youtubeVideoId ?? "",
        url: item.url ?? "",
        thumbnailUrl: item.thumbnailUrl ?? "",
        alt: item.alt ?? "",
        caption: item.caption ?? "",
        aspectRatio: item.aspectRatio,
      })
    ),
    blocks: contentBlockItemsFromDto(tutorial.blocks),
  };
}