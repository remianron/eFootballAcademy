"use client";

import { useState, useTransition } from "react";
import type { FeaturedContentType } from "@/generated/prisma/client";
import { Button } from "@/components";
import { IconEdit, IconEye, IconTrash } from "@/components/icons";
import {
  deleteFeaturedItemAction,
  toggleFeaturedItemAction,
} from "@/app/admin/featured/actions";

type FeaturedRowActionsProps = {
  itemId: string;
  contentType: FeaturedContentType;
  active: boolean;
  slug: string | null;
};

const VIEW_PREFIXES: Record<FeaturedContentType, string> = {
  BUILD: "/builds",
  TUTORIAL: "/tutorials",
  FORMATION_GUIDE: "/formations",
  DISCOVERY: "/discoveries",
  COACH: "/coaching",
};

export function FeaturedRowActions({
  itemId,
  contentType,
  active,
  slug,
}: FeaturedRowActionsProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () =>
    startTransition(async () => {
      setError(null);
      const result = await toggleFeaturedItemAction(itemId);
      if (!result.ok) setError(result.error);
    });

  const remove = () => {
    if (!window.confirm("Remove this featured item permanently?")) return;
    startTransition(async () => {
      setError(null);
      const result = await deleteFeaturedItemAction(itemId);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        {slug ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs"
            href={`${VIEW_PREFIXES[contentType]}/${slug}`}
          >
            <IconEye className="h-3.5 w-3.5" />
            View
          </Button>
        ) : (
          <span className="px-2.5 text-xs text-muted">No link</span>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/admin/featured/${itemId}/edit`}
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
          {active ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs text-danger"
          disabled={pending}
          onClick={remove}
        >
          <IconTrash className="h-3.5 w-3.5" />
          Remove
        </Button>
      </div>
      {error && <p className="mt-2 text-right text-xs text-danger">{error}</p>}
    </div>
  );
}