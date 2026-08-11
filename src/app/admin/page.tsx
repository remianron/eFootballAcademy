import type { Metadata } from "next";
import {
  AdminContentCard,
  AdminPageHeader,
  ADMIN_CONTENT_TYPE_ICONS,
  AdminStatCard,
} from "@/components/admin";
import { Badge, Card } from "@/components";
import {
  CONTENT_TYPE_LABELS,
  CONTENT_TYPE_PLURAL_LABELS,
  FEATURED_PLACEMENT_LABELS,
} from "@/lib/labels";
import { getAdminFeatured, getContentOverview } from "@/lib/admin";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Dashboard",
};

const sectionHref: Record<string, string> = {
  build: "/admin/builds",
  tutorial: "/admin/tutorials",
  "formation-guide": "/admin/formations",
  discovery: "/admin/discoveries",
  coach: "/admin/coaches",
};

export default async function AdminDashboardPage() {
  const [overview, featured] = await Promise.all([
    getContentOverview(),
    getAdminFeatured(),
  ]);

  const activeFeatured = featured.filter((entry) => entry.item.active).length;

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Admin / Dashboard"
        title="Content overview"
        description="Manage the content that powers the public eFootball Academy site. This is a development preview — authentication and persistence arrive in later phases."
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
            const hint =
              entry.type === "coach"
                ? `${entry.published} active · ${entry.drafts} hidden`
                : `${entry.published} published · ${entry.drafts} draft`;
            return (
              <AdminStatCard
                key={entry.type}
                href={sectionHref[entry.type]}
                label={CONTENT_TYPE_PLURAL_LABELS[entry.type]}
                value={entry.total}
                hint={hint}
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
              Manual homepage placement. Resolved through the same content
              abstraction the public site uses.
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
            featured.map(({ item, title }) => (
              <AdminContentCard
                key={`${item.type}-${item.contentId}`}
                label={
                  <Badge variant="outline">
                    {CONTENT_TYPE_LABELS[item.type]}
                  </Badge>
                }
                title={title}
                meta={`${item.contentId} · order ${item.order}`}
                status={
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">
                      {FEATURED_PLACEMENT_LABELS[item.placement]}
                    </Badge>
                    <Badge variant={item.active ? "success" : "neutral"}>
                      {item.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                }
                className={cn(!item.active && "opacity-60")}
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
            Content is defined in{" "}
            <code className="rounded-control bg-card-secondary px-1.5 py-0.5 text-xs text-electric">
              src/content/
            </code>{" "}
            and served to the public site and this admin area through the{" "}
            <code className="rounded-control bg-card-secondary px-1.5 py-0.5 text-xs text-electric">
              src/lib/content.ts
            </code>{" "}
            and{" "}
            <code className="rounded-control bg-card-secondary px-1.5 py-0.5 text-xs text-electric">
              src/lib/admin.ts
            </code>{" "}
            access layers. A future API can replace the data source without
            changing any page component.
          </p>
        </Card>
      </section>
    </div>
  );
}
