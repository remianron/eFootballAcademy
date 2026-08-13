import type { ContactMethod } from "@/generated/prisma/client";

export interface BookingInput {
  name: string;
  email: string;
  phone: string;
  contactMethod: ContactMethod | null;
  message: string;
}
