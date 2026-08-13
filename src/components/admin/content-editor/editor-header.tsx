"use client";

import type { PublishStatus } from "@/generated/prisma/client";
import { Button } from "@/components";
import { IconExternalLink } from "@/components/icons";
import { ContentStatusBadge } from "@/components/admin/content-editor/status-badge";

type EditorHeaderProps = {
  status?: PublishStatus;
  viewHref: string | null;
  pending: boolean;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
};

export function EditorHeader({
  status,
  viewHref,
  pending,
  onArchive,
  onRestore,
  onDelete,
}: EditorHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {status && <ContentStatusBadge status={status} />}
        {viewHref && (
          <a
            href={viewHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-electric"
          >
            View on site
            <IconExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      {status && (
        <div className="flex items-center gap-2">
          {status === "DRAFT" && onDelete && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={pending}
              onClick={onDelete}
            >
              Delete draft
            </Button>
          )}
          {status === "ARCHIVED" ? (
            onRestore && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={onRestore}
              >
                Restore as draft
              </Button>
            )
          ) : (
            onArchive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={onArchive}
              >
                Archive
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}