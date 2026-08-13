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
  listDiscoveriesOverview,
  type DiscoveryOverviewRow,
} from "@/lib/db/repositories/discoveries.repo";
import { formatDate } from "@/lib/labels";
import {
  DISCOVERY_CATEGORY_LABELS,
  RESEARCH_STATUS_LABELS,
} from "@/lib/content-editor/labels";

export const metadata: Metadata = {
  title: "Discoveries",
};

export const dynamic = "force-dynamic";

const columns: AdminColumn<DiscoveryOverviewRow>[] = [
  {
    header: "Title",
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
    header: "Research",
    render: (discovery) => (
      <span className="text-secondary">
        {RESEARCH_STATUS_LABELS[discovery.researchStatus]}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (discovery) => <ContentStatusBadge status={discovery.status} />,
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
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/discoveries/${discovery.slug}`}
        >
          <IconEye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/admin/discoveries/${discovery.id}/edit`}
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

export default async function AdminDiscoveriesPage() {
  const discoveries = await listDiscoveriesOverview();

  return (
    <>
      <AdminPageHeader
        eyebrow="Discoveries"
        title="Discovery management"
        description="Discoveries document research findings and experiments. Drafts stay hidden until you publish them."
        actions={<Button href="/admin/discoveries/new">New discovery</Button>}
      />

      <div className="mt-6">
        {discoveries.length === 0 ? (
          <AdminEmptyState
            title="No discoveries yet"
            description="Create the first discovery — it will appear here as a draft."
            action={<Button href="/admin/discoveries/new">New discovery</Button>}
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
    </>
  );
}