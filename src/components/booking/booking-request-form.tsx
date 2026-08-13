"use client";

import { useActionState } from "react";
import { Button } from "@/components";
import {
  inputClass,
  TextAreaField,
  TextField,
} from "@/components/admin/form";
import {
  submitBookingRequest,
  type BookingActionState,
} from "@/app/(site)/coaching/[slug]/book/actions";
import { cn } from "@/lib/cn";

const initialState: BookingActionState = { ok: false };

export function BookingRequestForm({ coachSlug }: { coachSlug: string }) {
  const [state, formAction, pending] = useActionState(
    submitBookingRequest.bind(null, coachSlug),
    initialState
  );

  if (state.ok) {
    return (
      <div className="py-6 text-center">
        <p className="font-display text-display-md font-semibold text-foreground">
          Booking request received
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Your coaching request has been received. The coach will review
          your request and arrange the session with you.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          href={`/coaching/${coachSlug}`}
        >
          Back to coach profile
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <TextField
        label="Full name"
        name="name"
        required
        autoComplete="name"
        error={state.errors?.name}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={state.errors?.email}
      />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        hint="Optional — only used to confirm this booking."
        error={state.errors?.phone}
      />
      <div>
        <label
          htmlFor="contact-method"
          className="mb-1.5 block text-xs font-semibold tracking-wide text-secondary"
        >
          Preferred contact method
          <span className="ml-1 text-xs font-normal text-muted">
            (optional)
          </span>
        </label>
        <select
          id="contact-method"
          name="contactMethod"
          defaultValue=""
          className={cn(inputClass, "appearance-none")}
        >
          <option value="">Not specified</option>
          <option value="EMAIL">Email</option>
          <option value="PHONE">Phone</option>
        </select>
        {state.errors?.contactMethod && (
          <p className="mt-1 text-xs leading-relaxed text-danger">
            {state.errors.contactMethod}
          </p>
        )}
      </div>
      <TextAreaField
        label="Message"
        name="message"
        rows={5}
        required
        hint="Tell the coach what you'd like to book."
        error={state.errors?.message}
      />

      {state.error && (
        <div className="rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          size="md"
          href={`/coaching/${coachSlug}`}
        >
          Cancel
        </Button>
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Sending…" : "Send booking request"}
        </Button>
      </div>
    </form>
  );
}
