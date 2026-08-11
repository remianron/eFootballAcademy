import Link from "next/link";
import { cn } from "@/lib/cn";
import type { PlayerBuild } from "@/content/types";

type BuildSwitcherProps = {
  cardName: string;
  builds: PlayerBuild[];
  activeSlug: string;
};

export function BuildSwitcher({
  cardName,
  builds,
  activeSlug,
}: BuildSwitcherProps) {
  return (
    <nav aria-label={`Builds for ${cardName}`}>
      <p className="text-eyebrow text-muted uppercase">{cardName}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {builds.map((build) => {
          const active = build.slug === activeSlug;
          return (
            <Link
              key={build.slug}
              href={`/builds/${build.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-control border px-4 py-2 font-display text-xs font-semibold tracking-wide uppercase transition-colors",
                "focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2",
                active
                  ? "border-electric/60 bg-electric/10 text-electric"
                  : "border-border bg-card-secondary text-secondary hover:border-primary/50 hover:text-electric"
              )}
            >
              {build.buildName}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
