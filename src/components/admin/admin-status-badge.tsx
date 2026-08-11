import { Badge } from "@/components/ui/badge";
import { PUBLISH_STATUS_LABELS } from "@/lib/labels";
import type { PublishStatus } from "@/content/types";

type AdminStatusValue = PublishStatus | "active" | "hidden";

const statusStyles: Record<
  AdminStatusValue,
  { label: string; variant: "success" | "warning" | "neutral" }
> = {
  published: { label: PUBLISH_STATUS_LABELS.published, variant: "success" },
  draft: { label: PUBLISH_STATUS_LABELS.draft, variant: "warning" },
  archived: { label: PUBLISH_STATUS_LABELS.archived, variant: "neutral" },
  active: { label: "Active", variant: "success" },
  hidden: { label: "Hidden", variant: "neutral" },
};

/**
 * Publication status badge for any content entity. Coaches use
 * active/hidden instead of published/draft.
 */
export function AdminStatusBadge({ status }: { status: AdminStatusValue }) {
  const { label, variant } = statusStyles[status];
  return <Badge variant={variant}>{label}</Badge>;
}
