import type { Metadata } from "next";
import {
  AdminCapabilities,
  AdminEmptyState,
  AdminPageHeader,
  AdminRowActions,
  AdminStatusBadge,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { getAdminBuilds } from "@/lib/admin";
import { formatDate } from "@/lib/labels";
import type { PlayerBuild } from "@/content/types";

export const metadata: Metadata = {
  title: "Builds",
};

const columns: AdminColumn<PlayerBuild>[] = [
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
    render: (build) => <AdminStatusBadge status={build.publishedStatus} />,
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
      <AdminRowActions
        viewHref={`/builds/${build.slug}`}
        status={build.publishedStatus}
      />
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminBuildsPage() {
  const builds = await getAdminBuilds();

  return (
    <>
      <AdminPageHeader
        eyebrow="Builds"
        title="Build management"
        description="A player card can carry multiple builds — Sole Control, Target Man and others. Editing, publishing and deleting become available in a later phase."
        actions={<Button disabled>New build</Button>}
      />

      <div className="mt-6">
        {builds.length === 0 ? (
          <AdminEmptyState
            title="No builds yet"
            description="Builds created here will appear in this list."
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

      <AdminCapabilities noun="player builds" />
    </>
  );
}
