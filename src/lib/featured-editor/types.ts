import type {
  FeaturedContentType,
  FeaturedPlacement,
} from "@/generated/prisma/client";

export interface FeaturedEditorFormState {
  contentType: FeaturedContentType | "";
  contentId: string;
  placement: FeaturedPlacement | "";
  order: string;
  active: boolean;
}

export interface FeaturedEditorInput {
  contentType: FeaturedContentType;
  contentId: string;
  placement: FeaturedPlacement;
  order: number;
  active: boolean;
}

export type FeaturedCatalog = Record<
  FeaturedContentType,
  { id: string; slug: string; title: string }[]
>;