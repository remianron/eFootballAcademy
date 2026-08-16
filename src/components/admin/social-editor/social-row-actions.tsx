"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components";
import { IconEdit, IconTrash } from "@/components/icons";
import {
  deleteSiteSocialLinkAction,
  toggleSiteSocialLinkAction,
} from "@/app/admin/social/actions";
import type { SiteSocialLinkDto } from "@/lib/db/types";

export function SocialRowActions({ link }: { link: SiteSocialLinkDto }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () =>
    startTransition(async () => {
      setError(null);
      const result = await toggleSiteSocialLinkAction(link.id);
      if (!result.ok) setError(result.error);
    });

  const remove = () => {
    if (!window.confirm("Delete this social link permanently?")) return;
    startTransition(async () => {
      setError(null);
      const result = await deleteSiteSocialLinkAction(link.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/admin/social/${link.id}/edit`}
        >
          <IconEdit className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs"
          disabled={pending}
          onClick={toggle}
        >
          {link.published ? "Unpublish" : "Publish"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs text-danger"
          disabled={pending}
          onClick={remove}
        >
          <IconTrash className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
      {error && <p className="mt-2 text-right text-xs text-danger">{error}</p>}
    </div>
  );
}