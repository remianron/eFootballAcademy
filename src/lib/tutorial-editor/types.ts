import type {
  Difficulty,
  PublishStatus,
  TutorialCategory,
} from "@/generated/prisma/client";
import type { ContentMediaInput } from "@/lib/content-editor/media-input";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";

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
  status: TutorialEditorStatus;
}