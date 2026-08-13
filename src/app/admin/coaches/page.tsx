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
  listCoachesOverview,
  type CoachOverviewRow,
} from "@/lib/db/repositories/coaches.repo";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Coaches",
};

export const dynamic = "force-dynamic";

const columns: AdminColumn<CoachOverviewRow>[] = [
  {
    header: "Name",
    render: (coach) => (
      <div>
        <p className="font-medium text-foreground">{coach.name}</p>
        <p className="mt-0.5 text-xs text-muted">{coach.slug}</p>
      </div>
    ),
  },
  {
    header: "Booking",
    render: (coach) =>
      coach.bookingEnabled ? (
        <Badge variant="success">Enabled</Badge>
      ) : (
        <span className="text-xs text-muted">Off</span>
      ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (coach) => <ContentStatusBadge status={coach.status} />,
    className: "whitespace-nowrap",
  },
  {
    header: "Updated",
    render: (coach) => (
      <span className="text-xs text-muted tabular-nums">
        {formatDate(coach.updatedAt)}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (coach) => (
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/coaching/${coach.slug}`}
        >
          <IconEye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/admin/coaches/${coach.id}/edit`}
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

export default async function AdminCoachesPage() {
  const coaches = await listCoachesOverview();

  return (
    <>
      <AdminPageHeader
        eyebrow="Coaches"
        title="Coach management"
        description="Public coach profiles carry a bio, specialties and social links. Drafts stay hidden until you publish them."
        actions={<Button href="/admin/coaches/new">New coach</Button>}
      />

      <div className="mt-6">
        {coaches.length === 0 ? (
          <AdminEmptyState
            title="No coaches yet"
            description="Create the first coach profile — it will appear here as a draft."
            action={<Button href="/admin/coaches/new">New coach</Button>}
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={coaches}
              getRowKey={(coach) => coach.id}
            />
          </Card>
        )}
      </div>
    </>
  );
}