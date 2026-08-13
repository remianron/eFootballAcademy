import type { Metadata } from "next";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminStatCard,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { FeaturedRowActions } from "@/components/admin/featured-editor/featured-row-actions";
import { IconPlus } from "@/components/icons";
import { listFeaturedEntries } from "@/lib/db/repositories/featured.repo";
import type { FeaturedEntryDto } from "@/lib/db/types";
import {
  FEATURED_CONTENT_TYPE_LABELS,
  FEATURED_PLACEMENT_LABELS,
} from "@/lib/content-editor/labels";

export const metadata: Metadata = {
  title: "Featured Content",
};

export const dynamic = "force-dynamic";

const columns: AdminColumn<FeaturedEntryDto>[] = [
  {
    header: "Type",
    render: (entry) => (
      <Badge variant="outline">
        {FEATURED_CONTENT_TYPE_LABELS[entry.contentType]}
      </Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Content",
    render: (entry) =>
      entry.content?.title ? (
        <div>
          <p className="font-medium text-foreground">{entry.content.title}</p>
          <p className="mt-0.5 text-xs text-muted">
            {entry.content.slug ?? entry.content.contentId}
          </p>
        </div>
      ) : (
        <p className="text-sm text-danger">Content no longer exists</p>
      ),
  },
  {
    header: "Placement",
    render: (entry) => (
      <Badge variant="neutral">
        {FEATURED_PLACEMENT_LABELS[entry.placement]}
      </Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Order",
    render: (entry) => (
      <span className="text-secondary tabular-nums">{entry.order}</span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (entry) => (
      <Badge variant={entry.active ? "success" : "neutral"}>
        {entry.active ? "Active" : "Inactive"}
      </Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (entry) => (
      <FeaturedRowActions
        itemId={entry.id}
        contentType={entry.contentType}
        active={entry.active}
        slug={entry.content?.slug ?? null}
      />
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminFeaturedPage() {
  const featured = await listFeaturedEntries();
  const active = featured.filter((entry) => entry.active).length;
  const inactive = featured.length - active;

  return (
    <>
      <AdminPageHeader
        eyebrow="Featured Content"
        title="Homepage featured content"
        description="Manually selected published content placed on the homepage — hero, featured, sidebar and latest placements, ordered within each placement."
        actions={
          <Button href="/admin/featured/new">
            <IconPlus className="h-4 w-4" />
            Add featured item
          </Button>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total items" value={featured.length} />
        <AdminStatCard
          label="Active"
          value={active}
          hint="Visible on the public site"
        />
        <AdminStatCard
          label="Inactive"
          value={inactive}
          hint="Reserved, not visible"
        />
      </div>

      <div className="mt-6">
        {featured.length === 0 ? (
          <AdminEmptyState
            title="No featured items yet"
            description="Feature published builds, tutorials, formations, discoveries and coaches on the homepage."
            action={
              <Button href="/admin/featured/new">Add featured item</Button>
            }
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={featured}
              getRowKey={(entry) => entry.id}
            />
          </Card>
        )}
      </div>
    </>
  );
}