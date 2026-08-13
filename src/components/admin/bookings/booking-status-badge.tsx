import type { BookingStatus } from "@/generated/prisma/client";
import { Badge } from "@/components";
import { BOOKING_STATUS_LABELS } from "@/lib/content-editor/labels";

const STATUS_VARIANTS: Record<BookingStatus, "primary" | "warning" | "neutral"> = {
  NEW: "primary",
  CONTACTED: "warning",
  CLOSED: "neutral",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={STATUS_VARIANTS[status]}>{BOOKING_STATUS_LABELS[status]}</Badge>;
}
