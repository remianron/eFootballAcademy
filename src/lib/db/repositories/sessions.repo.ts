import { prisma } from "@/lib/db/client";
import type { SessionDto } from "@/lib/db/types";
import type { SessionInput } from "@/lib/session/types";
import {
  hasSessionErrors,
  validateSessionInput,
  validateScheduledAt,
} from "@/lib/session/validation";

type SessionRow = {
  id: string;
  bookingRequestId: string;
  coachId: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: SessionDto["status"];
  priceAmount: unknown;
  currency: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  bookingRequest: { name: string; email: string };
  coach: { name: string; slug: string };
};

function toSessionDto(row: SessionRow): SessionDto {
  return {
    id: row.id,
    bookingRequestId: row.bookingRequestId,
    coachId: row.coachId,
    coachName: row.coach.name,
    coachSlug: row.coach.slug,
    requesterName: row.bookingRequest.name,
    requesterEmail: row.bookingRequest.email,
    scheduledAt: row.scheduledAt.toISOString(),
    durationMinutes: row.durationMinutes,
    status: row.status,
    priceAmount:
      row.priceAmount === null || row.priceAmount === undefined
        ? null
        : String(row.priceAmount),
    currency: row.currency,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const sessionInclude = {
  bookingRequest: { select: { name: true, email: true } },
  coach: { select: { name: true, slug: true } },
} as const;

export type CreateSessionResult =
  | { ok: true; session: SessionDto }
  | { ok: false; errors: Record<string, string>; error?: string };

/**
 * Create a session for a booking request. The coach is derived
 * server-side from the booking request — a coachId from the browser is
 * never trusted.
 */
export async function createSession(
  bookingRequestId: string,
  input: SessionInput
): Promise<CreateSessionResult> {
  const errors = validateSessionInput(input);
  if (hasSessionErrors(errors)) return { ok: false, errors };

  const bookingRequest = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
    select: { coachId: true },
  });
  if (!bookingRequest) {
    return { ok: false, errors: {}, error: "Booking request not found." };
  }

  const existing = await prisma.session.findUnique({
    where: { bookingRequestId },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      errors: {},
      error: "A session already exists for this booking request.",
    };
  }

  const scheduledAt = new Date(input.scheduledAt);
  const price = input.priceAmount.trim() || null;
  const currency = input.currency.trim() || null;

  const session = await prisma.session.create({
    data: {
      bookingRequestId,
      coachId: bookingRequest.coachId, // derived server-side
      scheduledAt,
      durationMinutes: input.durationMinutes,
      priceAmount: price,
      currency,
      notes: input.notes.trim() || null,
    },
    include: sessionInclude,
  });

  return { ok: true, session: toSessionDto(session) };
}

export async function getSessionByBookingId(
  bookingRequestId: string
): Promise<SessionDto | null> {
  const session = await prisma.session.findUnique({
    where: { bookingRequestId },
    include: sessionInclude,
  });
  return session ? toSessionDto(session) : null;
}

export async function getSessionById(id: string): Promise<SessionDto | null> {
  const session = await prisma.session.findUnique({
    where: { id },
    include: sessionInclude,
  });
  return session ? toSessionDto(session) : null;
}

export type SessionActionResult =
  | { ok: true; session: SessionDto }
  | { ok: false; error: string };

async function loadSession(id: string) {
  return prisma.session.findUnique({
    where: { id },
    include: sessionInclude,
  });
}

/**
 * Reschedule a session — only while it is still CONFIRMED. Rescheduling
 * is simply changing scheduledAt; there is no separate lifecycle state.
 */
export async function rescheduleSession(
  sessionId: string,
  scheduledAt: string
): Promise<SessionActionResult> {
  const errors: Record<string, string> = {};
  validateScheduledAt(errors, scheduledAt);
  if (hasSessionErrors(errors)) {
    return { ok: false, error: errors.scheduledAt ?? "Invalid scheduled time." };
  }

  const session = await loadSession(sessionId);
  if (!session) return { ok: false, error: "Session not found." };
  if (session.status !== "CONFIRMED") {
    return {
      ok: false,
      error:
        session.status === "COMPLETED"
          ? "A completed session cannot be rescheduled."
          : "A cancelled session cannot be rescheduled.",
    };
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { scheduledAt: new Date(scheduledAt) },
    include: sessionInclude,
  });
  return { ok: true, session: toSessionDto(updated) };
}

export async function completeSession(
  sessionId: string
): Promise<SessionActionResult> {
  const session = await loadSession(sessionId);
  if (!session) return { ok: false, error: "Session not found." };
  if (session.status === "COMPLETED") {
    return { ok: false, error: "Session is already completed." };
  }
  if (session.status === "CANCELLED") {
    return { ok: false, error: "A cancelled session cannot be completed." };
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { status: "COMPLETED" },
    include: sessionInclude,
  });
  return { ok: true, session: toSessionDto(updated) };
}

export async function cancelSession(
  sessionId: string
): Promise<SessionActionResult> {
  const session = await loadSession(sessionId);
  if (!session) return { ok: false, error: "Session not found." };
  if (session.status === "CANCELLED") {
    return { ok: false, error: "Session is already cancelled." };
  }
  if (session.status === "COMPLETED") {
    return { ok: false, error: "A completed session cannot be cancelled." };
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { status: "CANCELLED" },
    include: sessionInclude,
  });
  return { ok: true, session: toSessionDto(updated) };
}
