import type {
  Difficulty,
  PublishStatus,
  TutorialCategory,
} from "@/generated/prisma/client";
import type { ContentMediaInput } from "@/lib/content-editor/media-input";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { ContentBlockItem } from "@/lib/content-blocks/types";

export type TutorialEditorStatus = Extract<
  PublishStatus,
  "DRAFT" | "PUBLISHED" | "ARCHIVED"
>;

export interface TutorialEditorFormState {
  title: string;
  slug: string;
  slugTouched: boolean;
  category: TutorialCategory | "";
  difficulty: Difficulty | "";
  description: string;
  content: string;
  steps: string[];
  tips: string[];
  media: ContentMediaItem[];
  blocks: ContentBlockItem[];
}

export interface TutorialEditorInput {
  title: string;
  slug: string;
  category: TutorialCategory;
  difficulty: Difficulty;
  description: string;
  content: string;
  steps: string[];
  tips: string[];
  media: ContentMediaInput[];
  blocks: ContentBlockItem[];
  status: TutorialEditorStatus;
}