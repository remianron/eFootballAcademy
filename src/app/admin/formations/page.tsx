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
import { getAdminFormationGuides } from "@/lib/admin";
import { formatDate } from "@/lib/labels";
import type { FormationGuide } from "@/content/types";

export const metadata: Metadata = {
  title: "Formations",
};

const columns: AdminColumn<FormationGuide>[] = [
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
      <Badge variant="electric">{formation.formation}</Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Playstyle",
    render: (formation) => (
      <span className="text-secondary">{formation.playstyle}</span>
    ),
  },
  {
    header: "Status",
    render: (formation) => (
      <AdminStatusBadge status={formation.publishedStatus} />
    ),
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
      <AdminRowActions
        viewHref={`/formations/${formation.slug}`}
        status={formation.publishedStatus}
      />
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminFormationsPage() {
  const formations = await getAdminFormationGuides();

  return (
    <>
      <AdminPageHeader
        eyebrow="Formations"
        title="Formation guide management"
        description="Formation guides with tactical instructions and player roles. Editing, publishing and deleting become available in a later phase."
        actions={<Button disabled>New formation guide</Button>}
      />

      <div className="mt-6">
        {formations.length === 0 ? (
          <AdminEmptyState
            title="No formation guides yet"
            description="Formation guides created here will appear in this list."
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

      <AdminCapabilities noun="formation guides" />
    </>
  );
}
