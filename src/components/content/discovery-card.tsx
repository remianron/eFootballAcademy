import Link from "next/link";
import { Badge, Card } from "@/components";
import { IconArrowRight } from "@/components/icons";
import {
  DISCOVERY_CATEGORY_LABELS,
  formatDate,
  RESEARCH_STATUS_LABELS,
} from "@/lib/labels";
import type { Discovery } from "@/content/types";

export function DiscoveryCard({ discovery }: { discovery: Discovery }) {
  const researchStatus = discovery.researchStatus ?? "example";
  return (
    <Link
      href={`/discoveries/${discovery.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2"
    >
      <Card hover className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">
            {DISCOVERY_CATEGORY_LABELS[discovery.category]}
          </Badge>
          <Badge
            variant={researchStatus === "field-verified" ? "success" : "purple"}
          >
            {RESEARCH_STATUS_LABELS[researchStatus]}
          </Badge>
        </div>
        <h3 className="mt-4 font-display text-display-md font-semibold text-foreground">
          {discovery.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
          {discovery.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-xs text-muted">
            {discovery.author}
            {discovery.publishedAt && (
              <span className="text-muted/70">
                {" · "}
                {formatDate(discovery.publishedAt)}
              </span>
            )}
          </p>
          <IconArrowRight className="h-4 w-4 shrink-0 text-secondary transition-colors group-hover:text-electric" />
        </div>
      </Card>
    </Link>
  );
}
