import Image from "next/image";
import { Badge } from "@/components";
import { IconExternalLink, IconImage, IconPlay } from "@/components/icons";
import { cn } from "@/lib/cn";
import { extractYouTubeVideoId } from "@/lib/build-editor/youtube";
import type { ContentMedia, ContentMediaType } from "@/content/types";

const typeMeta: Record<ContentMediaType, { label: string; icon: typeof IconPlay }> = {
  video: { label: "Video", icon: IconPlay },
  gif: { label: "GIF", icon: IconImage },
  image: { label: "Image", icon: IconImage },
};

const ASPECT_CLASSES: Record<string, string> = {
  "16:9": "aspect-[16/9]",
  "9:16": "aspect-[9/16]",
  "1:1": "aspect-[1/1]",
};

function aspectClass(aspectRatio: string | undefined): string {
  if (aspectRatio && ASPECT_CLASSES[aspectRatio]) return ASPECT_CLASSES[aspectRatio];
  return "aspect-video";
}

/**
 * A 9:16 (vertical) video must not stretch to full desktop width: keep
 * its true aspect ratio but cap the width so it reads like a normal
 * media item. Fully responsive — on small screens it takes the full
 * available width.
 */
function verticalMediaClass(aspectRatio: string | undefined): string {
  return aspectRatio === "9:16" ? "mx-auto w-full max-w-sm" : "";
}

function frameClass(aspectRatio: string | undefined): string {
  return cn(
    "relative overflow-hidden rounded-control border border-border bg-card-secondary/60",
    aspectClass(aspectRatio),
    verticalMediaClass(aspectRatio)
  );
}

function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
}

function hasUrl(
  media: ContentMedia
): media is ContentMedia & { url: string } {
  return media.url !== undefined && media.url !== "";
}

export function ContentMediaList({
  media,
  className,
}: {
  media: ContentMedia[];
  className?: string;
}) {
  if (media.length === 0) return null;
  const [primary, ...rest] = media;

  return (
    <div className={className}>
      <ContentMediaItem media={primary} primary />
      {rest.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {rest.map((item, index) => (
            <ContentMediaItem key={index} media={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Side-by-side media layout used by media content blocks: items render
 * in a responsive grid (two columns from `sm` up; 3–4 items flow into
 * 2×2) and stack gracefully on mobile. A single item renders on its
 * own line, centered when vertical.
 */
export function ContentMediaRow({ media }: { media: ContentMedia[] }) {
  if (media.length === 0) return null;
  if (media.length === 1) {
    return (
      <div>
        <ContentMediaItem media={media[0]} />
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {media.map((item, index) => (
        <ContentMediaItem key={index} media={item} />
      ))}
    </div>
  );
}

export function ContentMediaItem({
  media,
  primary = false,
}: {
  media: ContentMedia;
  primary?: boolean;
}) {
  const meta = typeMeta[media.type];
  const isExternal = hasUrl(media);

  if (media.type === "video") {
    const videoId = extractYouTubeVideoId(media.youtubeVideoId ?? "");
    if (videoId) {
      const embedUrl = youtubeEmbedUrl(videoId);
      const title =
        media.caption || media.alt || `${meta.label} — ${videoId}`;
      return (
        <figure>
          <div className={frameClass(media.aspectRatio)}>
            <iframe
              src={embedUrl}
              title={title}
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {media.caption && (
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">
              {media.caption}
            </figcaption>
          )}
        </figure>
      );
    }
  }

  const figure = (
    <figure>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-control border bg-card-secondary/60",
          isExternal
            ? "border-border"
            : "border-dashed border-border",
          aspectClass(media.aspectRatio),
          verticalMediaClass(media.aspectRatio)
        )}
      >
        <Badge variant="outline" className="absolute top-3 left-3 z-10">
          {meta.label}
        </Badge>
        {isExternal ? (
          <Image
            src={media.url}
            alt={media.alt ?? ""}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span
            className={cn(
              "flex items-center justify-center rounded-full border border-electric/40 bg-card text-electric",
              primary ? "h-16 w-16" : "h-12 w-12"
            )}
          >
            <meta.icon className={primary ? "h-7 w-7" : "h-5 w-5"} />
          </span>
        )}
        {!isExternal && (
          <span className="absolute right-3 bottom-3 text-[0.625rem] tracking-widest text-muted/70 uppercase">
            Placeholder
          </span>
        )}
      </div>
      {media.caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">
          {media.caption}
        </figcaption>
      )}
    </figure>
  );

  if (isExternal) {
    return (
      <a
        href={media.url}
        target="_blank"
        rel="noreferrer"
        className="group block focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2"
      >
        {figure}
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-secondary transition-colors group-hover:text-electric">
          Open {meta.label.toLowerCase()}
          <IconExternalLink className="h-3.5 w-3.5" />
        </span>
      </a>
    );
  }

  return figure;
}
