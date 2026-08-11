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
import { Button, Card } from "@/components";
import { getAdminCoaches } from "@/lib/admin";
import { initials } from "@/lib/labels";
import type { Coach } from "@/content/types";

export const metadata: Metadata = {
  title: "Coaches",
};

const columns: AdminColumn<Coach>[] = [
  {
    header: "Coach",
    render: (coach) => (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-primary/40 bg-primary/10 text-xs font-bold text-electric">
          {initials(coach.name)}
        </span>
        <div>
          <p className="font-medium text-foreground">{coach.name}</p>
          <p className="mt-0.5 text-xs text-muted">{coach.slug}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Specialties",
    render: (coach) => (
      <span className="text-xs leading-relaxed text-secondary">
        {coach.specialties.slice(0, 2).join(", ")}
        {coach.specialties.length > 2
          ? ` +${coach.specialties.length - 2} more`
          : ""}
      </span>
    ),
  },
  {
    header: "Social links",
    render: (coach) => (
      <span className="text-secondary tabular-nums">
        {coach.socialLinks.length}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (coach) => <AdminStatusBadge status={coach.status} />,
    className: "whitespace-nowrap",
  },
  {
    header: "Updated",
    render: () => <span className="text-muted">—</span>,
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (coach) => (
      <AdminRowActions viewHref={`/coaching/${coach.slug}`} status={coach.status} />
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminCoachesPage() {
  const coaches = await getAdminCoaches();

  return (
    <>
      <AdminPageHeader
        eyebrow="Coaches"
        title="Coach management"
        description="Academy coaches shown on the homepage and coaching pages. Editing, publishing and deleting become available in a later phase."
        actions={<Button disabled>New coach</Button>}
      />

      <div className="mt-6">
        {coaches.length === 0 ? (
          <AdminEmptyState
            title="No coaches yet"
            description="Coaches created here will appear in this list."
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

      <AdminCapabilities noun="coaches" />
    </>
  );
}
