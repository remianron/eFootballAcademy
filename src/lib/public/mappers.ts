import type {
  BuildDetailDto,
  CoachDto,
  ContentBlockDto,
  DiscoveryDto,
  FormationDto,
  MediaDto,
  TutorialDto,
} from "@/lib/db/types";
import type {
  Coach,
  CommunityFeedback,
  ContentBlock,
  ContentMedia,
  Discovery,
  FormationGuide,
  Media,
  PlayerBuild,
  PlayerRole,
  Tutorial,
} from "@/content/types";
import type { BuildCardRowDto } from "@/lib/db/repositories/builds.repo";
import type { TutorialCardRowDto } from "@/lib/db/repositories/tutorials.repo";
import type { FormationCardRowDto } from "@/lib/db/repositories/formations.repo";
import type { DiscoveryCardRowDto } from "@/lib/db/repositories/discoveries.repo";

const PUBLISHED_STATUS_MAP = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
} as const;

const TUTORIAL_CATEGORY_MAP = {
  FREE_KICKS: "free-kicks",
  SKILLS: "skills",
  DRIBBLING: "dribbling",
  PASSING: "passing",
  SHOOTING: "shooting",
  CORNERS: "corners",
  MECHANICS: "mechanics",
} as const;

const DIFFICULTY_MAP = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

const DISCOVERY_CATEGORY_MAP = {
  EFOOTBALL_SCIENCE: "efootball-science",
  EXPERIMENTS: "experiments",
  COMMUNITY: "community",
  MECHANICS: "mechanics",
  UPDATES: "updates",
  META: "meta",
} as const;

const RESEARCH_STATUS_MAP = {
  EXAMPLE: "example",
  FIELD_VERIFIED: "field-verified",
} as const;

function iso(date: Date): string {
  return date.toISOString();
}

function youtubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function firstImage(media: MediaDto[]): Media | undefined {
  const image = media.find((item) => item.kind !== "YOUTUBE_VIDEO" && item.url);
  if (!image?.url) return undefined;
  return { src: image.url, alt: image.alt ?? "" };
}

const FEEDBACK_PLATFORM_MAP = {
  YOUTUBE: "YouTube",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
} as const;

export function toPublicContentMedia(media: MediaDto[]): ContentMedia[] {
  return media.flatMap((item): ContentMedia[] => {
    const mapped = toPublicContentMediaItem(item);
    return mapped ? [mapped] : [];
  });
}

type MediaItemLike = Pick<
  MediaDto,
  "kind" | "youtubeVideoId" | "aspectRatio" | "thumbnailUrl" | "url" | "alt" | "caption"
>;

function toPublicContentMediaItem(item: MediaItemLike): ContentMedia | null {
  if (item.kind === "YOUTUBE_VIDEO") {
    if (!item.youtubeVideoId) return null;
    return {
      type: "video",
      youtubeVideoId: item.youtubeVideoId,
      thumbnail: item.thumbnailUrl ?? undefined,
      caption: item.caption ?? undefined,
      aspectRatio: item.aspectRatio || undefined,
      alt: item.alt ?? undefined,
    };
  }
  if (!item.url) return null;
  const type: ContentMedia["type"] = item.kind === "GIF" ? "gif" : "image";
  return {
    type,
    url: item.url,
    thumbnail: item.thumbnailUrl ?? undefined,
    caption: item.caption ?? undefined,
    aspectRatio: item.aspectRatio || undefined,
    alt: item.alt ?? undefined,
  };
}

export function toPublicContentBlocks(blocks: ContentBlockDto[]): ContentBlock[] {
  return blocks.flatMap((block): ContentBlock[] => {
    switch (block.type) {
      case "heading":
        return [{ type: "heading", text: block.text, level: block.level }];
      case "text":
        return [{ type: "text", content: block.content }];
      case "media": {
        const media = block.media
          .map((item) => toPublicContentMediaItem(item))
          .filter((item): item is ContentMedia => item !== null);
        if (media.length === 0) return [];
        return [{ type: "media", media }];
      }
      case "attributes":
        return [{ type: "attributes", items: block.items }];
      case "custom":
        return [{ type: "custom", label: block.label, content: block.content }];
    }
  });
}

function toPublicFeedback(feedback: BuildDetailDto["feedback"]): CommunityFeedback[] {
  return feedback.map((item) => ({
    platform: FEEDBACK_PLATFORM_MAP[item.platform],
    author: item.author,
    comment: item.comment,
    profileUrl: item.profileUrl ?? undefined,
    avatar: item.avatarUrl ? { src: item.avatarUrl, alt: "" } : undefined,
    date: item.date ? iso(item.date) : undefined,
    verified: item.verified,
  }));
}

export function toPublicBuild(build: BuildDetailDto): PlayerBuild {
  const media = toPublicContentMedia(build.media);
  const blocks = toPublicContentBlocks(build.blocks);
  const feedback = toPublicFeedback(build.feedback);
  return {
    id: build.id,
    slug: build.slug,
    title: `${build.card.player.name} — ${build.buildName}`,
    playerName: build.card.player.name,
    cardName: build.card.cardName,
    position: build.card.position,
    overall: build.card.overall,
    buildName: build.buildName,
    shortDescription: build.shortDescription,
    philosophy: build.philosophy,
    keyAttributes: Object.fromEntries(
      build.keyAttributes.map((stat) => [stat.attributeName, stat.value])
    ),
    strengths: build.strengths,
    weaknesses: build.weaknesses,
    recommendedFor: build.recommendedFor,
    avoidFor: build.avoidFor,
    skills: build.skills.length > 0 ? build.skills : undefined,
    media: media.length > 0 ? media : undefined,
    blocks: blocks.length > 0 ? blocks : undefined,
    communityFeedback: feedback.length > 0 ? feedback : undefined,
    publishedStatus: PUBLISHED_STATUS_MAP[build.status],
    createdAt: iso(build.createdAt),
    updatedAt: iso(build.updatedAt),
  };
}

export function toPublicBuildCard(row: BuildCardRowDto): PlayerBuild {
  return {
    id: row.id,
    slug: row.slug,
    title: `${row.playerName} — ${row.buildName}`,
    playerName: row.playerName,
    cardName: row.cardName,
    position: row.position,
    overall: row.overall,
    buildName: row.buildName,
    shortDescription: row.shortDescription,
    philosophy: "",
    keyAttributes: {},
    strengths: [],
    weaknesses: [],
    recommendedFor: [],
    avoidFor: [],
    publishedStatus: PUBLISHED_STATUS_MAP[row.status],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toPublicTutorial(tutorial: TutorialDto): Tutorial {
  const video = tutorial.media.find(
    (item) => item.kind === "YOUTUBE_VIDEO" && item.youtubeVideoId
  );
  const thumbnail = firstImage(tutorial.media);
  const blocks = toPublicContentBlocks(tutorial.blocks);
  return {
    id: tutorial.id,
    slug: tutorial.slug,
    title: tutorial.title,
    category: TUTORIAL_CATEGORY_MAP[tutorial.category],
    description: tutorial.description,
    content: tutorial.content,
    difficulty: DIFFICULTY_MAP[tutorial.difficulty],
    steps: tutorial.steps.map((step) => step.text),
    tips: tutorial.tips,
    thumbnail,
    videoUrl: video?.youtubeVideoId ? youtubeUrl(video.youtubeVideoId) : undefined,
    media: toPublicContentMedia(tutorial.media),
    blocks: blocks.length > 0 ? blocks : undefined,
    publishedStatus: PUBLISHED_STATUS_MAP[tutorial.status],
    createdAt: iso(tutorial.createdAt),
    updatedAt: iso(tutorial.updatedAt),
  };
}

export function toPublicTutorialCard(row: TutorialCardRowDto): Tutorial {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: TUTORIAL_CATEGORY_MAP[row.category],
    description: row.description,
    content: "",
    difficulty: DIFFICULTY_MAP[row.difficulty],
    publishedStatus: PUBLISHED_STATUS_MAP[row.status],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toPublicFormationCard(row: FormationCardRowDto): FormationGuide {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    formation: row.formation,
    playstyle: row.playstyle,
    description: row.description,
    playerRoles: [],
    tacticalInstructions: [],
    strengths: [],
    weaknesses: [],
    recommendedUsage: "",
    publishedStatus: PUBLISHED_STATUS_MAP[row.status],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toPublicFormation(formation: FormationDto): FormationGuide {
  const roles: PlayerRole[] = formation.roles.map((role) => ({
    position: role.position,
    description: role.description,
  }));
  const blocks = toPublicContentBlocks(formation.blocks);
  return {
    id: formation.id,
    slug: formation.slug,
    title: formation.title,
    formation: formation.formation,
    playstyle: formation.playstyle,
    description: formation.description,
    diagram: firstImage(formation.media),
    playerRoles: roles,
    tacticalInstructions: formation.tacticalInstructions,
    strengths: formation.strengths,
    weaknesses: formation.weaknesses,
    recommendedUsage: formation.recommendedUsage,
    media: toPublicContentMedia(formation.media),
    blocks: blocks.length > 0 ? blocks : undefined,
    publishedStatus: PUBLISHED_STATUS_MAP[formation.status],
    createdAt: iso(formation.createdAt),
    updatedAt: iso(formation.updatedAt),
  };
}

export function toPublicDiscoveryCard(row: DiscoveryCardRowDto): Discovery {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: DISCOVERY_CATEGORY_MAP[row.category],
    excerpt: row.excerpt,
    content: "",
    author: row.author,
    publishedAt: row.publishedAt || undefined,
    researchStatus: RESEARCH_STATUS_MAP[row.researchStatus],
    publishedStatus: PUBLISHED_STATUS_MAP[row.status],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toPublicDiscovery(discovery: DiscoveryDto): Discovery {
  const blocks = toPublicContentBlocks(discovery.blocks);
  return {
    id: discovery.id,
    slug: discovery.slug,
    title: discovery.title,
    category: DISCOVERY_CATEGORY_MAP[discovery.category],
    excerpt: discovery.excerpt,
    content: discovery.content,
    findings: discovery.findings.length > 0 ? discovery.findings : undefined,
    author: discovery.author,
    sources: discovery.sources.length > 0 ? discovery.sources : undefined,
    thumbnail: firstImage(discovery.media),
    media: toPublicContentMedia(discovery.media),
    blocks: blocks.length > 0 ? blocks : undefined,
    publishedAt: discovery.publishedAt ? iso(discovery.publishedAt) : undefined,
    researchStatus: RESEARCH_STATUS_MAP[discovery.researchStatus],
    publishedStatus: PUBLISHED_STATUS_MAP[discovery.status],
    createdAt: iso(discovery.createdAt),
    updatedAt: iso(discovery.updatedAt),
  };
}

export function toPublicCoach(coach: CoachDto): Coach {
  const blocks = toPublicContentBlocks(coach.blocks);
  return {
    id: coach.id,
    slug: coach.slug,
    name: coach.name,
    profileImage: firstImage(coach.media),
    bio: coach.bio,
    specialties: coach.specialties,
    socialLinks: coach.socialLinks.map((link) => ({
      platform: link.platform,
      url: link.url,
    })),
    coachingDescription: coach.coachingDescription,
    status: coach.status === "PUBLISHED" ? "active" : "hidden",
    booking: { enabled: coach.bookingEnabled },
    media: toPublicContentMedia(coach.media),
    blocks: blocks.length > 0 ? blocks : undefined,
  };
}