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
import { getAdminDiscoveries } from "@/lib/admin";
import {
  DISCOVERY_CATEGORY_LABELS,
  formatDate,
  RESEARCH_STATUS_LABELS,
} from "@/lib/labels";
import type { Discovery } from "@/content/types";

export const metadata: Metadata = {
  title: "Discoveries",
};

const columns: AdminColumn<Discovery>[] = [
  {
    header: "Discovery",
    render: (discovery) => (
      <div>
        <p className="font-medium text-foreground">{discovery.title}</p>
        <p className="mt-0.5 text-xs text-muted">{discovery.slug}</p>
      </div>
    ),
  },
  {
    header: "Category",
    render: (discovery) => (
      <Badge variant="neutral">
        {DISCOVERY_CATEGORY_LABELS[discovery.category]}
      </Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Author",
    render: (discovery) => (
      <span className="text-secondary">{discovery.author}</span>
    ),
  },
  {
    header: "Research",
    render: (discovery) =>
      discovery.researchStatus ? (
        <Badge variant="purple">
          {RESEARCH_STATUS_LABELS[discovery.researchStatus]}
        </Badge>
      ) : (
        <span className="text-muted">—</span>
      ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (discovery) => (
      <AdminStatusBadge status={discovery.publishedStatus} />
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Updated",
    render: (discovery) => (
      <span className="text-xs text-muted tabular-nums">
        {formatDate(discovery.updatedAt)}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (discovery) => (
      <AdminRowActions
        viewHref={`/discoveries/${discovery.slug}`}
        status={discovery.publishedStatus}
      />
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminDiscoveriesPage() {
  const discoveries = await getAdminDiscoveries();

  return (
    <>
      <AdminPageHeader
        eyebrow="Discoveries"
        title="Discovery management"
        description="eFootball Science articles, experiments and meta notes. Editing, publishing and deleting become available in a later phase."
        actions={<Button disabled>New discovery</Button>}
      />

      <div className="mt-6">
        {discoveries.length === 0 ? (
          <AdminEmptyState
            title="No discoveries yet"
            description="Discoveries created here will appear in this list."
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={discoveries}
              getRowKey={(discovery) => discovery.id}
            />
          </Card>
        )}
      </div>

      <AdminCapabilities noun="discoveries" />
    </>
  );
}
