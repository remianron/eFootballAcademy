"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components";
import { inputClass } from "@/components/admin/form";
import {
  cancelSessionAction,
  completeSessionAction,
  rescheduleSessionAction,
} from "@/app/admin/bookings/session-actions";
import type { SessionDto } from "@/lib/db/types";
import { cn } from "@/lib/cn";

type SessionActionsPanelProps = {
  bookingId: string;
  session: SessionDto;
};

/**
 * Session controls: reschedule (while confirmed), mark completed, cancel.
 * Completed sessions cannot be cancelled; the server enforces this too.
 */
export function SessionActionsPanel({
  bookingId,
  session,
}: SessionActionsPanelProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const run = (action: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (!result.ok) setError(result.error ?? "Something went wrong.");
    });

  const reschedule = () => {
    if (!scheduledAt) {
      setError("Choose a new scheduled time.");
      return;
    }
    const iso = new Date(scheduledAt).toISOString();
    run(() => rescheduleSessionAction(bookingId, session.id, iso));
  };

  const complete = () => {
    if (
      !window.confirm("Mark this session as completed? This cannot be undone.")
    ) {
      return;
    }
    run(() => completeSessionAction(bookingId, session.id));
  };

  const cancel = () => {
    if (
      !window.confirm(
        "Cancel this session? A completed session cannot be cancelled."
      )
    ) {
      return;
    }
    run(() => cancelSessionAction(bookingId, session.id));
  };

  return (
    <div className="mt-6">
      {rescheduling && session.status === "CONFIRMED" ? (
        <div className="flex flex-wrap items-end gap-3 rounded-control border border-border bg-card-secondary/40 p-4">
          <div className="min-w-56 flex-1">
            <label
              htmlFor="reschedule-time"
              className="mb-1.5 block text-xs font-semibold tracking-wide text-secondary"
            >
              New scheduled time
            </label>
            <input
              id="reschedule-time"
              type="datetime-local"
              className={cn(inputClass)}
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={pending}
              onClick={reschedule}
            >
              {pending ? "Saving…" : "Save new time"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => setRescheduling(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {session.status === "CONFIRMED" && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => setRescheduling(true)}
              >
                Reschedule
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={pending}
                onClick={complete}
              >
                Mark completed
              </Button>
            </>
          )}
          {session.status !== "COMPLETED" && (
            <Button
              variant="danger"
              size="sm"
              disabled={pending}
              onClick={cancel}
            >
              Cancel session
            </Button>
          )}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
}
