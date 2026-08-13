import type {
  DiscoveryCategory,
  PublishStatus,
  ResearchStatus,
} from "@/generated/prisma/client";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { ContentMediaInput } from "@/lib/content-editor/media-input";

export type DiscoveryEditorStatus = Extract<PublishStatus, "DRAFT" | "PUBLISHED">;

export interface DiscoveryEditorFormState {
  title: string;
  slug: string;
  slugTouched: boolean;
  category: DiscoveryCategory | "";
  excerpt: string;
  content: string;
  findings: string[];
  author: string;
  sources: string[];
  researchStatus: ResearchStatus | "";
  media: ContentMediaItem[];
}

export interface DiscoveryEditorInput {
  title: string;
  slug: string;
  category: DiscoveryCategory;
  excerpt: string;
  content: string;
  findings: string[];
  author: string;
  sources: string[];
  researchStatus: ResearchStatus;
  media: ContentMediaInput[];
  status: DiscoveryEditorStatus;
}

export interface DiscoveryEditorState {
  id: string;
  slug: string;
  title: string;
  status: PublishStatus;
}