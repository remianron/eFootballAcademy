"use server";

import { revalidatePath } from "next/cache";
import {
  cancelSession,
  completeSession,
  createSession,
  rescheduleSession,
} from "@/lib/db/repositories/sessions.repo";
import {
  dataSourceFailure,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";
import type { SessionInput } from "@/lib/session/types";

export type SessionActionResult =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string };

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Admin session actions. All run under /admin, so they are protected by
 * the existing admin proxy guard; no action ever trusts a coachId from
 * the browser — the coach is derived from the booking request
 * server-side in the repository.
 */

export async function createSessionAction(
  bookingId: string,
  prevState: SessionActionResult,
  formData: FormData
): Promise<SessionActionResult> {
  try {
    const input: SessionInput = {
      scheduledAt: readFormString(formData, "scheduledAt"),
      durationMinutes: Number(readFormString(formData, "durationMinutes")),
      priceAmount: readFormString(formData, "priceAmount"),
      currency: readFormString(formData, "currency"),
      notes: readFormString(formData, "notes"),
    };
    const result = await createSession(bookingId, input);
    if (!result.ok) return result;
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function rescheduleSessionAction(
  bookingId: string,
  sessionId: string,
  scheduledAt: string
): Promise<SessionActionResult> {
  try {
    const result = await rescheduleSession(sessionId, scheduledAt);
    if (!result.ok) return result;
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function completeSessionAction(
  bookingId: string,
  sessionId: string
): Promise<SessionActionResult> {
  try {
    const result = await completeSession(sessionId);
    if (!result.ok) return result;
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function cancelSessionAction(
  bookingId: string,
  sessionId: string
): Promise<SessionActionResult> {
  try {
    const result = await cancelSession(sessionId);
    if (!result.ok) return result;
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}
