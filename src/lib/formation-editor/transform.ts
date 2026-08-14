import type { FormationDto } from "@/lib/db/types";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import { contentBlockItemsFromDto } from "@/lib/content-blocks/transform";
import type { FormationEditorFormState } from "@/lib/formation-editor/types";

export function emptyFormationFormState(): FormationEditorFormState {
  return {
    title: "",
    slug: "",
    slugTouched: false,
    formation: "",
    playstyle: "",
    description: "",
    recommendedUsage: "",
    tacticalInstructions: [],
    strengths: [],
    weaknesses: [],
    roles: [],
    media: [],
    blocks: [],
  };
}

export function formationFormStateFromDto(
  formation: FormationDto
): FormationEditorFormState {
  return {
    title: formation.title,
    slug: formation.slug,
    slugTouched: true,
    formation: formation.formation,
    playstyle: formation.playstyle,
    description: formation.description,
    recommendedUsage: formation.recommendedUsage,
    tacticalInstructions: formation.tacticalInstructions,
    strengths: formation.strengths,
    weaknesses: formation.weaknesses,
    roles: formation.roles.map((role) => ({
      first: role.position,
      second: role.description,
    })),
    media: formation.media.map(
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
    blocks: contentBlockItemsFromDto(formation.blocks),
  };
}