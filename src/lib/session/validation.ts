import type { SessionInput } from "@/lib/session/types";

/**
 * Controlled duration options — the only accepted session lengths.
 * The value must be validated server-side, never taken at face value
 * from the browser.
 */
export const SESSION_DURATION_OPTIONS = [30, 45, 60, 90, 120] as const;
export type SessionDurationMinutes = (typeof SESSION_DURATION_OPTIONS)[number];

/**
 * Controlled currency list. Informational only — no conversion, no
 * payment workflow.
 */
export const SESSION_CURRENCIES = ["BDT", "USD", "EUR", "GBP", "AED"] as const;
export type SessionCurrency = (typeof SESSION_CURRENCIES)[number];

export const SESSION_NOTES_MAX = 2000;
export const SESSION_PRICE_MAX = 10_000;

const PRICE_PATTERN = /^\d+(\.\d{1,2})?$/;

export function hasSessionErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

function parseScheduledAt(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function validateScheduledAt(
  errors: Record<string, string>,
  value: string,
  label = "Scheduled time"
): void {
  const date = parseScheduledAt(value);
  if (!date) {
    errors.scheduledAt = `Enter a valid ${label.toLowerCase()}.`;
    return;
  }
  if (date.getTime() <= Date.now()) {
    errors.scheduledAt = `${label} must be in the future.`;
  }
}

export function validateDurationMinutes(
  errors: Record<string, string>,
  value: number
): void {
  if (
    typeof value !== "number" ||
    !SESSION_DURATION_OPTIONS.includes(value as SessionDurationMinutes)
  ) {
    errors.durationMinutes = "Choose a valid session duration.";
  }
}

export function validatePriceAmount(
  errors: Record<string, string>,
  value: string
): void {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (!PRICE_PATTERN.test(trimmed)) {
    errors.priceAmount =
      "Price must be a positive amount with up to 2 decimal places.";
    return;
  }
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.priceAmount = "Price must be greater than 0.";
  } else if (amount > SESSION_PRICE_MAX) {
    errors.priceAmount = `Price must be ${SESSION_PRICE_MAX.toLocaleString("en-US")}.00 or less.`;
  }
}

export function validateCurrency(
  errors: Record<string, string>,
  value: string
): void {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (!(SESSION_CURRENCIES as readonly string[]).includes(trimmed)) {
    errors.currency = "Choose a valid currency.";
  }
}

export function validateNotes(
  errors: Record<string, string>,
  value: string
): void {
  if (value.length > SESSION_NOTES_MAX) {
    errors.notes = `Notes must be ${SESSION_NOTES_MAX} characters or fewer.`;
  }
}

export function validateSessionInput(
  input: SessionInput
): Record<string, string> {
  const errors: Record<string, string> = {};

  validateScheduledAt(errors, input.scheduledAt);
  validateDurationMinutes(errors, input.durationMinutes);
  validatePriceAmount(errors, input.priceAmount);
  validateCurrency(errors, input.currency);
  validateNotes(errors, input.notes.trim());

  return errors;
}
