import type { DiscoveryDto } from "@/lib/db/types";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import { contentBlockItemsFromDto } from "@/lib/content-blocks/transform";
import type { DiscoveryEditorFormState } from "@/lib/discovery-editor/types";

export function emptyDiscoveryFormState(): DiscoveryEditorFormState {
  return {
    title: "",
    slug: "",
    slugTouched: false,
    category: "",
    excerpt: "",
    content: "",
    findings: [],
    author: "",
    sources: [],
    researchStatus: "",
    media: [],
    blocks: [],
  };
}

export function discoveryFormStateFromDto(
  discovery: DiscoveryDto
): DiscoveryEditorFormState {
  return {
    title: discovery.title,
    slug: discovery.slug,
    slugTouched: true,
    category: discovery.category,
    excerpt: discovery.excerpt,
    content: discovery.content,
    findings: discovery.findings,
    author: discovery.author,
    sources: discovery.sources,
    researchStatus: discovery.researchStatus,
    media: discovery.media.map(
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
    blocks: contentBlockItemsFromDto(discovery.blocks),
  };
}