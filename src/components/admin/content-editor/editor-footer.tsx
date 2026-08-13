"use client";

import { Button } from "@/components";

type EditorFooterProps = {
  listHref: string;
  pending: boolean;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  draft?: boolean;
  saveLabel?: string;
  publishLabel?: string;
};

export function EditorFooter({
  listHref,
  pending,
  onSaveDraft,
  onPublish,
  draft = true,
  saveLabel = "Save draft",
  publishLabel = "Publish",
}: EditorFooterProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      <Button type="button" variant="ghost" size="md" href={listHref}>
        Back
      </Button>
      <div className="flex flex-wrap items-center gap-3">
        {draft && onSaveDraft && (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={onSaveDraft}
          >
            {saveLabel}
          </Button>
        )}
        {onPublish && (
          <Button type="button" disabled={pending} onClick={onPublish}>
            {publishLabel}
          </Button>
        )}
      </div>
    </div>
  );
}