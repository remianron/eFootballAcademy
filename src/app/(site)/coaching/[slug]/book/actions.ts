"use server";

import type { BookingInput } from "@/lib/booking/types";
import { createBookingRequest } from "@/lib/db/repositories/bookings.repo";
import {
  dataSourceFailure,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";
import { getPublishedCoachBySlug } from "@/lib/public";

export type BookingActionState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string };

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function submitBookingRequest(
  coachSlug: string,
  prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  try {
    const coach = await getPublishedCoachBySlug(coachSlug);
    if (!coach || !coach.booking?.enabled) {
      return { ok: false, error: "Booking is not available for this coach." };
    }

    const contactMethodValue = readFormString(formData, "contactMethod");
    const input: BookingInput = {
      name: readFormString(formData, "name"),
      email: readFormString(formData, "email"),
      phone: readFormString(formData, "phone"),
      contactMethod:
        contactMethodValue === "EMAIL" || contactMethodValue === "PHONE"
          ? contactMethodValue
          : null,
      message: readFormString(formData, "message"),
    };

    const result = await createBookingRequest(coach.id, input);
    if (!result.ok) return result;
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}
