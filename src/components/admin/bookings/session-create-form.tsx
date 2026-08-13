"use client";

import { useActionState } from "react";
import { Button } from "@/components";
import { TextAreaField, TextField, inputClass } from "@/components/admin/form";
import { createSessionAction } from "@/app/admin/bookings/session-actions";
import {
  SESSION_CURRENCIES,
  SESSION_DURATION_OPTIONS,
} from "@/lib/session/validation";
import { cn } from "@/lib/cn";

type SessionCreateState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string };

const initialState: SessionCreateState = { ok: false };

export function SessionCreateForm({ bookingId }: { bookingId: string }) {
  const [state, formAction, pending] = useActionState(
    createSessionAction.bind(null, bookingId),
    initialState
  );

  if (state.ok) {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-display-md font-semibold text-foreground">
          Session created
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          The session was added to this booking. The page is now showing the
          session details.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-5 space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Scheduled time"
          name="scheduledAt"
          type="datetime-local"
          required
          hint="The date and time the coach and player agreed on."
          error={state.errors?.scheduledAt}
        />
        <div>
          <label
            htmlFor="session-duration"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-secondary"
          >
            Duration
            <span className="ml-1 text-electric">*</span>
          </label>
          <select
            id="session-duration"
            name="durationMinutes"
            defaultValue={60}
            className={cn(inputClass, "appearance-none")}
          >
            {SESSION_DURATION_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minutes
              </option>
            ))}
          </select>
          {state.errors?.durationMinutes && (
            <p className="mt-1 text-xs leading-relaxed text-danger">
              {state.errors.durationMinutes}
            </p>
          )}
        </div>
        <TextField
          label="Agreed price (optional)"
          name="priceAmount"
          inputMode="decimal"
          placeholder="e.g. 25.50"
          hint="Informational only — payment is arranged directly between the coach and player."
          error={state.errors?.priceAmount}
        />
        <div>
          <label
            htmlFor="session-currency"
            className="mb-1.5 block text-xs font-semibold tracking-wide text-secondary"
          >
            Currency (optional)
          </label>
          <select
            id="session-currency"
            name="currency"
            defaultValue=""
            className={cn(inputClass, "appearance-none")}
          >
            <option value="">Not specified</option>
            {SESSION_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          {state.errors?.currency && (
            <p className="mt-1 text-xs leading-relaxed text-danger">
              {state.errors.currency}
            </p>
          )}
        </div>
      </div>

      <TextAreaField
        label="Session notes (optional)"
        name="notes"
        rows={3}
        hint="Internal notes for the coaching team — not shown publicly."
        error={state.errors?.notes}
      />

      {state.error && (
        <div className="rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Creating…" : "Create session"}
        </Button>
      </div>
    </form>
  );
}
