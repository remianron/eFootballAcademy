import { Badge } from "@/components";
import { IconExternalLink, IconImage, IconPlay } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { BuildMedia, BuildMediaType } from "@/content/types";

const typeMeta: Record<BuildMediaType, { label: string; icon: typeof IconPlay }> = {
  video: { label: "Video", icon: IconPlay },
  gif: { label: "GIF", icon: IconImage },
  image: { label: "Image", icon: IconImage },
};

export function BuildMediaList({ media }: { media: BuildMedia[] }) {
  if (media.length === 0) return null;
  const [primary, ...rest] = media;

  return (
    <div>
      <BuildMediaItem media={primary} primary />
      {rest.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {rest.map((item, index) => (
            <BuildMediaItem key={index} media={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function BuildMediaItem({
  media,
  primary = false,
}: {
  media: BuildMedia;
  primary?: boolean;
}) {
  const meta = typeMeta[media.type];
  const isExternal = media.url !== undefined && media.url !== "#";

  const figure = (
    <figure>
      <div
        className={cn(
          "relative flex aspect-video items-center justify-center rounded-control border border-dashed border-border bg-card-secondary/60",
          primary ? "p-10" : "p-6"
        )}
      >
        <Badge variant="outline" className="absolute top-3 left-3">
          {meta.label}
        </Badge>
        <span
          className={cn(
            "flex items-center justify-center rounded-full border border-electric/40 bg-card text-electric",
            primary ? "h-16 w-16" : "h-12 w-12"
          )}
        >
          <meta.icon className={primary ? "h-7 w-7" : "h-5 w-5"} />
        </span>
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
