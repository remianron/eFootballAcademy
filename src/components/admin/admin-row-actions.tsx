import { Button } from "@/components/ui/button";
import type { PublishStatus } from "@/content/types";

type AdminStatusValue = PublishStatus | "active" | "hidden";

const PLANNED_HINT = "Planned for a later phase";

type AdminRowActionsProps = {
  /** Public site route for the row (Read). */
  viewHref?: string;
  status?: AdminStatusValue;
};

/**
 * Row-level CRUD actions. Viewing is available now; edit, publish and
 * delete are disabled placeholders until the management phase.
 */
export function AdminRowActions({ viewHref, status }: AdminRowActionsProps) {
  const isPublished =
    status === "published" || status === "active" || status === "hidden";
  const publishLabel = isPublished ? "Unpublish" : "Publish";

  return (
    <div className="flex items-center gap-1.5">
      {viewHref && (
        <Button size="sm" variant="outline" href={viewHref}>
          View
        </Button>
      )}
      <Button size="sm" variant="secondary" disabled title={PLANNED_HINT}>
        Edit
      </Button>
      <Button size="sm" variant="outline" disabled title={PLANNED_HINT}>
        {publishLabel}
      </Button>
      <Button size="sm" variant="danger" disabled title={PLANNED_HINT}>
        Delete
      </Button>
    </div>
  );
}
