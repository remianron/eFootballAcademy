import Link from "next/link";
import { Badge, Card } from "@/components";
import { IconArrowRight } from "@/components/icons";
import type { FormationGuide } from "@/content/types";

export function FormationCard({
  formation,
}: {
  formation: FormationGuide;
}) {
  return (
    <Link
      href={`/formations/${formation.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2"
    >
      <Card hover className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-3xl font-bold text-foreground tabular-nums">
            {formation.formation}
          </p>
          <Badge variant="primary">{formation.playstyle}</Badge>
        </div>
        <h3 className="mt-4 font-display text-display-md font-semibold text-foreground">
          {formation.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
          {formation.description}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium text-secondary transition-colors group-hover:text-electric">
          View guide
          <IconArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
}
