import type { PublishStatus } from "@/generated/prisma/client";
import type { PairItem } from "@/components/admin/form/pair-list-editor";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { ContentMediaInput } from "@/lib/content-editor/media-input";

export type FormationEditorStatus = Extract<PublishStatus, "DRAFT" | "PUBLISHED">;

export interface FormationEditorFormState {
  title: string;
  slug: string;
  slugTouched: boolean;
  formation: string;
  playstyle: string;
  description: string;
  recommendedUsage: string;
  tacticalInstructions: string[];
  strengths: string[];
  weaknesses: string[];
  roles: PairItem[];
  media: ContentMediaItem[];
}

export interface FormationEditorInput {
  title: string;
  slug: string;
  formation: string;
  playstyle: string;
  description: string;
  recommendedUsage: string;
  tacticalInstructions: string[];
  strengths: string[];
  weaknesses: string[];
  roles: { position: string; description: string }[];
  media: ContentMediaInput[];
  status: FormationEditorStatus;
}