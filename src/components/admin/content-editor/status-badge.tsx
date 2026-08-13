import type { PublishStatus } from "@/generated/prisma/client";
import { AdminStatusBadge } from "@/components/admin";

const STATUS_BADGE_MAP: Record<PublishStatus, "published" | "draft" | "archived"> = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
};

export function ContentStatusBadge({ status }: { status: PublishStatus }) {
  return <AdminStatusBadge status={STATUS_BADGE_MAP[status]} />;
}