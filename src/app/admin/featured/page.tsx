import type { Metadata } from "next";
import {
  AdminPageHeader,
  AdminRowActions,
  AdminStatCard,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { getAdminFeatured, type AdminFeaturedEntry } from "@/lib/admin";
import {
  CONTENT_TYPE_LABELS,
  FEATURED_PLACEMENT_LABELS,
} from "@/lib/labels";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Featured Content",
};

const columns: AdminColumn<AdminFeaturedEntry>[] = [
  {
    header: "Type",
    render: (entry) => (
      <Badge variant="outline">{CONTENT_TYPE_LABELS[entry.item.type]}</Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Content",
    render: (entry) => (
      <div>
        <p className="font-medium text-foreground">{entry.title}</p>
        <p className="mt-0.5 text-xs text-muted">{entry.item.contentId}</p>
      </div>
    ),
  },
  {
    header: "Placement",
    render: (entry) => (
      <Badge variant="neutral">
        {FEATURED_PLACEMENT_LABELS[entry.item.placement]}
      </Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Order",
    render: (entry) => (
      <span className="text-secondary tabular-nums">{entry.item.order}</span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (entry) => (
      <Badge variant={entry.item.active ? "success" : "neutral"}>
        {entry.item.active ? "Active" : "Inactive"}
      </Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (entry) => (
      <AdminRowActions viewHref={entry.href ?? undefined} />
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminFeaturedPage() {
  const featured = await getAdminFeatured();
  const active = featured.filter((entry) => entry.item.active).length;
  const inactive = featured.length - active;
  const placements = new Set(featured.map((entry) => entry.item.placement))
    .size;

  return (
    <>
      <AdminPageHeader
        eyebrow="Featured Content"
        title="Homepage featured content"
        description="Manually selected content placed on the homepage. The public site reads featured items through the same abstraction shown here — hero, featured, sidebar and latest placements, ordered within each placement."
        actions={<Button disabled>Add featured item</Button>}
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

      <Card padded={false} className="mt-6">
        <AdminTable
          columns={columns}
          rows={featured}
          getRowKey={(entry) => `${entry.item.type}-${entry.item.contentId}`}
          emptyMessage="No featured items configured yet."
          className={cn("border-t border-border/60", featured.length === 0 && "border-t-0")}
        />
      </Card>

      <Card className="mt-6">
        <h2 className="font-display text-display-md font-semibold text-foreground">
          Placements
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {placements} placement type{placements === 1 ? "" : "s"} in use:
          hero, featured, sidebar and latest. Items are sorted by order within
          each placement, and only active items with published content reach
          the public site.
        </p>
      </Card>
    </>
  );
}
