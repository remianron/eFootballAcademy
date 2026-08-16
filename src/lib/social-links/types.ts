/**
 * Editor-side form state for a global site social link. `sortOrder` is a
 * string because the admin NumberField edits raw input.
 */
export interface SiteSocialLinkFormState {
  platform: string;
  label: string;
  url: string;
  published: boolean;
  sortOrder: string;
}

export interface SiteSocialLinkInput {
  platform: string;
  label: string;
  url: string;
  published: boolean;
  sortOrder: number;
}