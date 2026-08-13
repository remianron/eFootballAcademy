"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteBooking,
  setBookingStatus,
} from "@/lib/db/repositories/bookings.repo";
import {
  dataSourceFailure,
  isDataSourceUnavailableError,
} from "@/lib/db/errors";
import type { BookingStatus } from "@/generated/prisma/client";

export type BookingAdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function setBookingStatusAction(
  bookingId: string,
  status: BookingStatus
): Promise<BookingAdminActionResult> {
  try {
    const result = await setBookingStatus(bookingId, status);
    if (!result.ok) return result;
    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true };
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}

export async function deleteBookingAction(
  bookingId: string
): Promise<BookingAdminActionResult> {
  try {
    const result = await deleteBooking(bookingId);
    if (!result.ok) return result;
    revalidatePath("/admin/bookings");
    redirect("/admin/bookings");
  } catch (error) {
    if (isDataSourceUnavailableError(error)) return dataSourceFailure();
    throw error;
  }
}
