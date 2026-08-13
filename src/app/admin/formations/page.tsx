import type { Metadata } from "next";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { ContentStatusBadge } from "@/components/admin/content-editor";
import { IconEdit, IconEye } from "@/components/icons";
import {
  listFormationsOverview,
  type FormationOverviewRow,
} from "@/lib/db/repositories/formations.repo";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Formations",
};

export const dynamic = "force-dynamic";

const columns: AdminColumn<FormationOverviewRow>[] = [
  {
    header: "Guide",
    render: (formation) => (
      <div>
        <p className="font-medium text-foreground">{formation.title}</p>
        <p className="mt-0.5 text-xs text-muted">{formation.slug}</p>
      </div>
    ),
  },
  {
    header: "Formation",
    render: (formation) => (
      <Badge variant="neutral">{formation.formation}</Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Playstyle",
    render: (formation) => (
      <span className="text-secondary">{formation.playstyle}</span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (formation) => <ContentStatusBadge status={formation.status} />,
    className: "whitespace-nowrap",
  },
  {
    header: "Updated",
    render: (formation) => (
      <span className="text-xs text-muted tabular-nums">
        {formatDate(formation.updatedAt)}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (formation) => (
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/formations/${formation.slug}`}
        >
          <IconEye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/admin/formations/${formation.id}/edit`}
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

export default async function AdminFormationsPage() {
  const formations = await listFormationsOverview();

  return (
    <>
      <AdminPageHeader
        eyebrow="Formations"
        title="Formation guide management"
        description="Formation guides combine a shape, playstyle and key player roles. Drafts stay hidden until you publish them."
        actions={<Button href="/admin/formations/new">New formation</Button>}
      />

      <div className="mt-6">
        {formations.length === 0 ? (
          <AdminEmptyState
            title="No formations yet"
            description="Create the first formation guide — it will appear here as a draft."
            action={<Button href="/admin/formations/new">New formation</Button>}
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={formations}
              getRowKey={(formation) => formation.id}
            />
          </Card>
        )}
      </div>
    </>
  );
}