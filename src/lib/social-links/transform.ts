import type { SiteSocialLinkDto } from "@/lib/db/types";
import type { SiteSocialLinkFormState } from "@/lib/social-links/types";

export function siteSocialLinkFormStateFromDto(
  dto: SiteSocialLinkDto
): SiteSocialLinkFormState {
  return {
    platform: dto.platform,
    label: dto.label,
    url: dto.url,
    published: dto.published,
    sortOrder: String(dto.sortOrder),
  };
}

export function emptySiteSocialLinkFormState(): SiteSocialLinkFormState {
  return {
    platform: "",
    label: "",
    url: "",
    published: false,
    sortOrder: "1",
  };
}