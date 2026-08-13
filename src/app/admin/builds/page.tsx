import type { Metadata } from "next";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminStatusBadge,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { IconEdit, IconEye } from "@/components/icons";
import { listBuildsOverview, type BuildOverviewRow } from "@/lib/db/repositories/builds.repo";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Builds",
};

export const dynamic = "force-dynamic";

const STATUS_BADGE_MAP: Record<
  BuildOverviewRow["status"],
  "published" | "draft" | "archived"
> = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
};

const columns: AdminColumn<BuildOverviewRow>[] = [
  {
    header: "Player",
    render: (build) => (
      <span className="font-medium text-foreground">{build.playerName}</span>
    ),
  },
  {
    header: "Card",
    render: (build) => <span className="text-secondary">{build.cardName}</span>,
  },
  {
    header: "Build",
    render: (build) => (
      <div>
        <p className="font-medium text-secondary">{build.buildName}</p>
        <p className="mt-0.5 text-xs text-muted">{build.slug}</p>
      </div>
    ),
  },
  {
    header: "Position",
    render: (build) => <Badge variant="neutral">{build.position}</Badge>,
    className: "whitespace-nowrap",
  },
  {
    header: "Overall",
    render: (build) => (
      <span className="font-display font-bold text-foreground tabular-nums">
        {build.overall}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (build) => (
      <AdminStatusBadge status={STATUS_BADGE_MAP[build.status]} />
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Updated",
    render: (build) => (
      <span className="text-xs text-muted tabular-nums">
        {formatDate(build.updatedAt)}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (build) => (
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/builds/${build.slug}`}
        >
          <IconEye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/admin/builds/${build.id}/edit`}
        >
          <IconEdit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminBuildsPage() {
  const builds = await listBuildsOverview();

  return (
    <>
      <AdminPageHeader
        eyebrow="Builds"
        title="Build management"
        description="A player card can carry multiple builds — Sole Control, Target Man and others. Draft builds stay hidden until you publish them."
        actions={
          <Button href="/admin/builds/new">New build</Button>
        }
      />

      <div className="mt-6">
        {builds.length === 0 ? (
          <AdminEmptyState
            title="No builds yet"
            description="Create the first build — it will appear here as a draft."
            action={<Button href="/admin/builds/new">New build</Button>}
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={builds}
              getRowKey={(build) => build.id}
            />
          </Card>
        )}
      </div>
    </>
  );
}