import type { Metadata } from "next";
import {
  AdminContentCard,
  AdminPageHeader,
  ADMIN_CONTENT_TYPE_ICONS,
  AdminStatCard,
} from "@/components/admin";
import { Badge, Card } from "@/components";
import type { ContentType } from "@/content/types";
import {
  FEATURED_CONTENT_TYPE_LABELS,
  FEATURED_PLACEMENT_LABELS,
} from "@/lib/content-editor/labels";
import { listBuildsOverview } from "@/lib/db/repositories/builds.repo";
import { listCoachesOverview } from "@/lib/db/repositories/coaches.repo";
import { listDiscoveriesOverview } from "@/lib/db/repositories/discoveries.repo";
import { listFeaturedEntries } from "@/lib/db/repositories/featured.repo";
import { listFormationsOverview } from "@/lib/db/repositories/formations.repo";
import { listTutorialsOverview } from "@/lib/db/repositories/tutorials.repo";
import { CONTENT_TYPE_PLURAL_LABELS } from "@/lib/labels";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

const sectionHref: Record<ContentType, string> = {
  build: "/admin/builds",
  tutorial: "/admin/tutorials",
  "formation-guide": "/admin/formations",
  discovery: "/admin/discoveries",
  coach: "/admin/coaches",
};

interface OverviewEntry {
  type: ContentType;
  total: number;
  published: number;
  drafts: number;
}

function summarize(
  type: ContentType,
  rows: { status: string }[]
): OverviewEntry {
  return {
    type,
    total: rows.length,
    published: rows.filter((row) => row.status === "PUBLISHED").length,
    drafts: rows.filter((row) => row.status === "DRAFT").length,
  };
}

export default async function AdminDashboardPage() {
  const [builds, tutorials, formations, discoveries, coaches, featured] =
    await Promise.all([
      listBuildsOverview(),
      listTutorialsOverview(),
      listFormationsOverview(),
      listDiscoveriesOverview(),
      listCoachesOverview(),
      listFeaturedEntries(),
    ]);

  const overview: OverviewEntry[] = [
    summarize("build", builds),
    summarize("tutorial", tutorials),
    summarize("formation-guide", formations),
    summarize("discovery", discoveries),
    summarize("coach", coaches),
  ];

  const activeFeatured = featured.filter((entry) => entry.active).length;

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Admin / Dashboard"
        title="Content overview"
        description="Manage the content that powers the public eFootball Academy site. Content is stored in the database and published here after sign-in."
      />

      <section aria-labelledby="content-counts-heading">
        <h2
          id="content-counts-heading"
          className="text-eyebrow font-display text-muted uppercase"
        >
          Content overview
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {overview.map((entry) => {
            const TypeIcon = ADMIN_CONTENT_TYPE_ICONS[entry.type];
            return (
              <AdminStatCard
                key={entry.type}
                href={sectionHref[entry.type]}
                label={CONTENT_TYPE_PLURAL_LABELS[entry.type]}
                value={entry.total}
                hint={`${entry.published} published · ${entry.drafts} draft`}
                icon={<TypeIcon className="h-4 w-4" />}
              />
            );
          })}
        </div>
      </section>

      <section aria-labelledby="featured-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              id="featured-heading"
              className="text-eyebrow font-display text-muted uppercase"
            >
              Featured content
            </h2>
            <p className="mt-1 text-sm text-muted">
              Manual homepage placement. Resolved through the same repositories
              the public site uses.
            </p>
          </div>
          <Badge variant="neutral">
            {activeFeatured} of {featured.length} active
          </Badge>
        </div>

        <Card padded={false} className="mt-4">
          {featured.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              No featured items configured yet.
            </p>
          ) : (
            featured.map((entry) => (
              <AdminContentCard
                key={entry.id}
                label={
                  <Badge variant="outline">
                    {FEATURED_CONTENT_TYPE_LABELS[entry.contentType]}
                  </Badge>
                }
                title={entry.content?.title ?? "Missing content"}
                meta={`${entry.contentId} · order ${entry.order}`}
                status={
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">
                      {FEATURED_PLACEMENT_LABELS[entry.placement]}
                    </Badge>
                    <Badge variant={entry.active ? "success" : "neutral"}>
                      {entry.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                }
                className={cn(!entry.active && "opacity-60")}
              />
            ))
          )}
        </Card>
      </section>

      <section aria-labelledby="data-source-heading">
        <Card>
          <h2
            id="data-source-heading"
            className="font-display text-display-md font-semibold text-foreground"
          >
            Content source
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            All content — builds, tutorials, formation guides, discoveries,
            coaches and featured placements — lives in the MySQL/MariaDB
            database and is accessed through the Prisma repositories in{" "}
            <code className="rounded-control bg-card-secondary px-1.5 py-0.5 text-xs text-electric">
              src/lib/db/repositories/
            </code>
            . The public site only reads published content; this admin area
            reads every row through the same repositories.
          </p>
        </Card>
      </section>
    </div>
  );
}
