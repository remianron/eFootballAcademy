"use client";

import { useState, useTransition } from "react";
import { Badge, Button, Card } from "@/components";
import { IconTrash } from "@/components/icons";
import {
  deleteBookingAction,
  setBookingStatusAction,
} from "@/app/admin/bookings/actions";
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import type { BookingStatus } from "@/generated/prisma/client";
import { BOOKING_STATUS_LABELS } from "@/lib/content-editor/labels";
import { cn } from "@/lib/cn";

type BookingAdminPanelProps = {
  bookingId: string;
  status: BookingStatus;
};

const ALL_STATUSES: BookingStatus[] = ["NEW", "CONTACTED", "CLOSED"];

export function BookingAdminPanel({
  bookingId,
  status,
}: BookingAdminPanelProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const changeStatus = (target: BookingStatus) =>
    startTransition(async () => {
      setError(null);
      const result = await setBookingStatusAction(bookingId, target);
      if (!result.ok) setError(result.error);
    });

  const remove = () => {
    if (
      !window.confirm(
        "Delete this booking request permanently? This cannot be undone."
      )
    ) {
      return;
    }
    startTransition(async () => {
      setError(null);
      const result = await deleteBookingAction(bookingId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <Card className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-display-md font-semibold text-foreground">
            Request status
          </h2>
          <p className="mt-1 text-sm text-muted">
            Track whether the requester has been contacted.
          </p>
        </div>
        <BookingStatusBadge status={status} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {ALL_STATUSES.map((target) => {
          const active = target === status;
          return (
            <Button
              key={target}
              size="sm"
              variant={active ? "secondary" : "ghost"}
              disabled={pending || active}
              className={cn(active && "cursor-default")}
              onClick={() => changeStatus(target)}
            >
              {BOOKING_STATUS_LABELS[target]}
              {active && (
                <Badge variant="success" className="ml-1">
                  Current
                </Badge>
              )}
            </Button>
          );
        })}
        <span className="flex-1" />
        <Button
          variant="danger"
          size="sm"
          disabled={pending}
          onClick={remove}
        >
          <IconTrash className="h-3.5 w-3.5" />
          Delete request
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </Card>
  );
}
