import type { BuildDetailDto } from "@/lib/db/types";
import type { BuildEditorFormState } from "@/lib/build-editor/types";

export function emptyFormState(): BuildEditorFormState {
  return {
    playerName: "",
    playerSlug: "",
    playerSlugTouched: false,
    cardName: "",
    rarity: "",
    position: "",
    overall: "",
    buildName: "",
    buildSlug: "",
    buildSlugTouched: false,
    playstyle: "",
    shortDescription: "",
    philosophy: "",
    skills: [],
    recommendedFor: [],
    avoidFor: [],
    statistics: {},
    keyAttributes: [],
    strengths: [],
    weaknesses: [],
    screenshot: { url: "", alt: "", caption: "" },
    media: [],
  };
}

export function formStateFromBuild(
  build: BuildDetailDto
): BuildEditorFormState {
  const statistics: Record<string, string> = {};
  for (const stat of build.statistics) {
    statistics[stat.attributeKey] = String(stat.value);
  }
  const primary = build.media.find(
    (item) => item.kind === "IMAGE" && item.isPrimary
  );
  const rest = build.media.filter(
    (item) => !(item.kind === "IMAGE" && item.isPrimary)
  );
  return {
    playerName: build.card.player.name,
    playerSlug: build.card.player.slug,
    playerSlugTouched: true,
    cardName: build.card.cardName,
    rarity: build.card.rarity ?? "",
    position: build.card.position,
    overall: String(build.card.overall),
    buildName: build.buildName,
    buildSlug: build.slug,
    buildSlugTouched: true,
    playstyle: build.playstyle ?? "",
    shortDescription: build.shortDescription,
    philosophy: build.philosophy,
    skills: build.skills,
    recommendedFor: build.recommendedFor,
    avoidFor: build.avoidFor,
    statistics,
    keyAttributes: build.keyAttributes.map((stat) => stat.attributeKey),
    strengths: build.strengths,
    weaknesses: build.weaknesses,
    screenshot: primary
      ? {
          url: primary.url ?? "",
          alt: primary.alt ?? "",
          caption: primary.caption ?? "",
        }
      : { url: "", alt: "", caption: "" },
    media: rest.map((item) => ({
      uid: item.id,
      kind: item.kind,
      youtubeInput: item.youtubeVideoId ?? "",
      url: item.url ?? "",
      thumbnailUrl: item.thumbnailUrl ?? "",
      alt: item.alt ?? "",
      caption: item.caption ?? "",
      aspectRatio: item.aspectRatio,
    })),
  };
}