/**
 * Session input types shared by validation, repositories and actions.
 * scheduledAt is submitted as an ISO 8601 datetime string; priceAmount
 * and currency are informational only (payment is arranged privately
 * between the coach and the player).
 */

export interface SessionInput {
  scheduledAt: string; // ISO datetime — must be in the future
  durationMinutes: number;
  priceAmount: string; // "" or a decimal string like "25.50"
  currency: string; // "" or a currency code (see SESSION_CURRENCIES)
  notes: string;
}