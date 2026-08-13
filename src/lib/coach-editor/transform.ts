import type { CoachDto } from "@/lib/db/types";
import type { ContentMediaItem } from "@/components/admin/form/media-editor";
import type { CoachEditorFormState } from "@/lib/coach-editor/types";

export function emptyCoachFormState(): CoachEditorFormState {
  return {
    name: "",
    slug: "",
    slugTouched: false,
    bio: "",
    coachingDescription: "",
    specialties: [],
    bookingEnabled: false,
    socialLinks: [],
    media: [],
  };
}

export function coachFormStateFromDto(coach: CoachDto): CoachEditorFormState {
  return {
    name: coach.name,
    slug: coach.slug,
    slugTouched: true,
    bio: coach.bio,
    coachingDescription: coach.coachingDescription,
    specialties: coach.specialties,
    bookingEnabled: coach.bookingEnabled,
    socialLinks: coach.socialLinks.map((link) => ({
      first: link.platform,
      second: link.url,
    })),
    media: coach.media.map(
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
  };
}