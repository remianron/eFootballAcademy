import type { Metadata } from "next";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminStatCard,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Button, Card } from "@/components";
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import { listBookingsOverview } from "@/lib/db/repositories/bookings.repo";
import type { BookingOverviewRow } from "@/lib/db/repositories/bookings.repo";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Bookings",
};

export const dynamic = "force-dynamic";

const columns: AdminColumn<BookingOverviewRow>[] = [
  {
    header: "Coach",
    render: (booking) => (
      <div>
        <p className="font-medium text-foreground">{booking.coachName}</p>
        <p className="mt-0.5 text-xs text-muted">{booking.coachSlug}</p>
      </div>
    ),
  },
  {
    header: "Requester",
    render: (booking) => (
      <p className="font-medium text-foreground">{booking.name}</p>
    ),
  },
  {
    header: "Email",
    render: (booking) => <span className="text-sm">{booking.email}</span>,
  },
  {
    header: "Submitted",
    render: (booking) => (
      <span className="text-xs text-muted tabular-nums">
        {formatDate(booking.createdAt)}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (booking) => <BookingStatusBadge status={booking.status} />,
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (booking) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 px-2.5 text-xs"
        href={`/admin/bookings/${booking.id}`}
      >
        View
      </Button>
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminBookingsPage() {
  const bookings = await listBookingsOverview();

  const counts = {
    total: bookings.length,
    new: bookings.filter((booking) => booking.status === "NEW").length,
    contacted: bookings.filter((booking) => booking.status === "CONTACTED")
      .length,
    closed: bookings.filter((booking) => booking.status === "CLOSED").length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Bookings"
        title="Booking requests"
        description="Booking requests visitors submit from published coach profiles."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total requests"
          value={counts.total}
          hint="All time"
        />
        <AdminStatCard
          label="New"
          value={counts.new}
          hint="Awaiting action"
        />
        <AdminStatCard
          label="Contacted"
          value={counts.contacted}
          hint="In conversation"
        />
        <AdminStatCard
          label="Closed"
          value={counts.closed}
          hint="Completed or declined"
        />
      </div>

      <div className="mt-6">
        {bookings.length === 0 ? (
          <AdminEmptyState
            title="No booking requests yet"
            description="Booking requests appear here as soon as visitors submit them from coach profiles."
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={bookings}
              getRowKey={(booking) => booking.id}
            />
          </Card>
        )}
      </div>
    </>
  );
}
