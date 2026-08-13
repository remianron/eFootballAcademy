import type { SessionStatus } from "@/generated/prisma/client";
import { Badge } from "@/components";
import { SESSION_STATUS_LABELS } from "@/lib/content-editor/labels";

const STATUS_VARIANTS: Record<
  SessionStatus,
  "primary" | "success" | "danger"
> = {
  CONFIRMED: "primary",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]}>
      {SESSION_STATUS_LABELS[status]}
    </Badge>
  );
}
