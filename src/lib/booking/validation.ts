import type { BookingInput } from "@/lib/booking/types";

export const BOOKING_NAME_MAX = 100;
export const BOOKING_EMAIL_MAX = 254;
export const BOOKING_PHONE_MAX = 30;
export const BOOKING_MESSAGE_MAX = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingInput(
  input: BookingInput
): Record<string, string> {
  const errors: Record<string, string> = {};

  const name = input.name.trim();
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length > BOOKING_NAME_MAX) {
    errors.name = `Name must be ${BOOKING_NAME_MAX} characters or fewer.`;
  }

  const email = input.email.trim();
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > BOOKING_EMAIL_MAX) {
    errors.email = `Email must be ${BOOKING_EMAIL_MAX} characters or fewer.`;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const phone = input.phone.trim();
  if (phone.length > BOOKING_PHONE_MAX) {
    errors.phone = `Phone must be ${BOOKING_PHONE_MAX} characters or fewer.`;
  }

  if (
    input.contactMethod !== null &&
    input.contactMethod !== "EMAIL" &&
    input.contactMethod !== "PHONE"
  ) {
    errors.contactMethod = "Please choose a valid contact method.";
  }

  const message = input.message.trim();
  if (!message) {
    errors.message = "Please tell us what you'd like to book.";
  } else if (message.length > BOOKING_MESSAGE_MAX) {
    errors.message = `Message must be ${BOOKING_MESSAGE_MAX} characters or fewer.`;
  }

  return errors;
}

export function hasBookingErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}
