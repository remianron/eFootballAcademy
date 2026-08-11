import Link from "next/link";
import { Card } from "@/components";
import { IconArrowRight } from "@/components/icons";
import { initials } from "@/lib/labels";
import type { Coach } from "@/content/types";

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Link
      href={`/coaching/${coach.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2"
    >
      <Card hover className="flex h-full flex-col">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-lg font-bold text-electric"
          >
            {initials(coach.name)}
          </span>
          <div>
            <h3 className="font-display text-display-md font-semibold text-foreground">
              {coach.name}
            </h3>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">
              Expert Coach
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {coach.specialties.slice(0, 4).map((specialty) => (
            <span
              key={specialty}
              className="rounded-pill border border-border bg-card-secondary px-2.5 py-1 text-[0.6875rem] font-medium text-secondary"
            >
              {specialty}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-2">
          {coach.bio}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium text-secondary transition-colors group-hover:text-electric">
          View profile
          <IconArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
}
