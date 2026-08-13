import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { BookingAdminPanel } from "@/components/admin/bookings/booking-admin-panel";
import { SessionActionsPanel } from "@/components/admin/bookings/session-actions-panel";
import { SessionCreateForm } from "@/components/admin/bookings/session-create-form";
import { SessionStatusBadge } from "@/components/admin/bookings/session-status-badge";
import { getBookingById } from "@/lib/db/repositories/bookings.repo";
import { CONTACT_METHOD_LABELS } from "@/lib/content-editor/labels";
import { formatDate, formatDateTime, formatDuration } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Booking request",
};

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({
  params,
}: PageProps<"/admin/bookings/[id]">) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        eyebrow="Bookings"
        title={booking.name}
        description={`Booking request for ${booking.coachName} — submitted ${formatDate(booking.createdAt)}.`}
        actions={
          <Button variant="ghost" href="/admin/bookings">
            Back to bookings
          </Button>
        }
      />

      <Card className="mt-6">
        <h2 className="font-display text-display-md font-semibold text-foreground">
          Request details
        </h2>

        <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              Coach
            </dt>
            <dd className="mt-1.5">
              <a
                href={`/coaching/${booking.coachSlug}`}
                className="text-sm font-medium text-secondary transition-colors hover:text-electric"
              >
                {booking.coachName}
              </a>
              <span className="ml-2 text-xs text-muted">
                /coaching/{booking.coachSlug}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              Requester
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-foreground">
              {booking.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              Email
            </dt>
            <dd className="mt-1.5 text-sm text-secondary">{booking.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              Phone
            </dt>
            <dd className="mt-1.5 text-sm text-secondary">
              {booking.phone ?? (
                <span className="text-muted">Not provided</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              Preferred contact method
            </dt>
            <dd className="mt-1.5 text-sm text-secondary">
              {booking.contactMethod ? (
                CONTACT_METHOD_LABELS[booking.contactMethod]
              ) : (
                <span className="text-muted">Not specified</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              Created
            </dt>
            <dd className="mt-1.5 text-sm text-secondary tabular-nums">
              {formatDate(booking.createdAt)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
              Status
            </dt>
            <dd className="mt-1.5">
              <Badge variant="neutral">{booking.status}</Badge>
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">
            Message
          </h3>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-secondary">
            {booking.message}
          </p>
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-display-md font-semibold text-foreground">
              Coaching session
            </h2>
            <p className="mt-1 text-sm text-muted">
              Schedule the session with the coach. Payment is arranged
              directly between the coach and player.
            </p>
          </div>
          {booking.session && (
            <SessionStatusBadge status={booking.session.status} />
          )}
        </div>

        {!booking.session ? (
          <SessionCreateForm bookingId={booking.id} />
        ) : (
          <>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Scheduled
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground tabular-nums">
                  {formatDateTime(booking.session.scheduledAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Duration
                </dt>
                <dd className="mt-1.5 text-sm text-secondary">
                  {formatDuration(booking.session.durationMinutes)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Agreed price
                </dt>
                <dd className="mt-1.5 text-sm text-secondary tabular-nums">
                  {booking.session.priceAmount && booking.session.currency ? (
                    `${booking.session.priceAmount} ${booking.session.currency}`
                  ) : (
                    <span className="text-muted">Not specified</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Created
                </dt>
                <dd className="mt-1.5 text-sm text-secondary tabular-nums">
                  {formatDate(booking.session.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Updated
                </dt>
                <dd className="mt-1.5 text-sm text-secondary tabular-nums">
                  {formatDate(booking.session.updatedAt)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Notes
                </dt>
                <dd className="mt-1.5 text-sm text-secondary whitespace-pre-wrap">
                  {booking.session.notes ?? (
                    <span className="text-muted">No notes</span>
                  )}
                </dd>
              </div>
            </dl>

            <SessionActionsPanel
              bookingId={booking.id}
              session={booking.session}
            />
          </>
        )}
      </Card>

      <BookingAdminPanel bookingId={booking.id} status={booking.status} />
    </div>
  );
}
