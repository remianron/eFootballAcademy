import { prisma } from "@/lib/db/client";
import type { BookingStatus } from "@/generated/prisma/client";
import type { BookingDto } from "@/lib/db/types";
import type { BookingInput } from "@/lib/booking/types";
import {
  hasBookingErrors,
  validateBookingInput,
} from "@/lib/booking/validation";
import { getSessionByBookingId } from "@/lib/db/repositories/sessions.repo";

export interface BookingOverviewRow {
  id: string;
  coachName: string;
  coachSlug: string;
  name: string;
  email: string;
  status: BookingStatus;
  createdAt: string;
}

export async function createBookingRequest(
  coachId: string,
  input: BookingInput
): Promise<{ ok: true; id: string } | { ok: false; errors: Record<string, string> }> {
  const errors = validateBookingInput(input);
  if (hasBookingErrors(errors)) return { ok: false, errors };

  const booking = await prisma.bookingRequest.create({
    data: {
      coachId,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim() || null,
      contactMethod: input.contactMethod,
      message: input.message.trim(),
    },
    select: { id: true },
  });

  return { ok: true, id: booking.id };
}

export async function listBookingsOverview(): Promise<BookingOverviewRow[]> {
  const rows = await prisma.bookingRequest.findMany({
    select: {
      id: true,
      coach: { select: { name: true, slug: true } },
      name: true,
      email: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    coachName: row.coach.name,
    coachSlug: row.coach.slug,
    name: row.name,
    email: row.email,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getBookingById(id: string): Promise<BookingDto | null> {
  const row = await prisma.bookingRequest.findUnique({
    where: { id },
    include: {
      coach: { select: { name: true, slug: true } },
    },
  });
  if (!row) return null;

  const session = await getSessionByBookingId(row.id);

  return {
    id: row.id,
    coachId: row.coachId,
    coachName: row.coach.name,
    coachSlug: row.coach.slug,
    name: row.name,
    email: row.email,
    phone: row.phone,
    contactMethod: row.contactMethod,
    message: row.message,
    status: row.status,
    session,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function setBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Booking request not found." };
  await prisma.bookingRequest.update({
    where: { id: bookingId },
    data: { status },
  });
  return { ok: true };
}

export async function deleteBooking(
  bookingId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const existing = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Booking request not found." };
  await prisma.bookingRequest.delete({ where: { id: bookingId } });
  return { ok: true };
}
