import Link from "next/link";
import { Badge, Card } from "@/components";
import { IconArrowRight } from "@/components/icons";
import { MediaPlaceholder } from "@/components/content/media-placeholder";
import type { PlayerBuild } from "@/content/types";

export function BuildCard({ build }: { build: PlayerBuild }) {
  return (
    <Link
      href={`/builds/${build.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2"
    >
      <Card hover className="flex h-full flex-col">
        <MediaPlaceholder
          label={`${build.playerName} card`}
          className="aspect-[16/10] w-full"
        />
        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-display-md font-semibold text-foreground">
              {build.playerName}
            </p>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">
              {build.cardName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-gold tabular-nums">
              {build.overall}
            </p>
            <p className="text-[0.625rem] font-medium tracking-[0.2em] text-muted uppercase">
              OVR
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{build.position}</Badge>
          <span className="rounded-pill border border-border bg-card-secondary px-2.5 py-0.5 text-[0.6875rem] font-medium text-electric">
            {build.buildName}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-2">
          {build.shortDescription}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium text-secondary transition-colors group-hover:text-electric">
          View build
          <IconArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
}
