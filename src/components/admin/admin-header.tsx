"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { IconChevronRight, IconExternalLink } from "@/components/icons";
import { getAdminNavLabel } from "@/components/admin/admin-nav";

/**
 * Sticky top bar for the admin area. Shows the current section crumb,
 * a development-preview indicator and a link back to the public site.
 */
export function AdminHeader() {
  const pathname = usePathname();
  const section = getAdminNavLabel(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <span className="shrink-0 text-muted">Admin</span>
          <IconChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" />
          <span className="truncate font-medium text-foreground">{section}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Badge variant="warning">Dev preview</Badge>
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-xs font-medium text-secondary transition-colors hover:text-electric sm:inline-flex"
          >
            <IconExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>
        </div>
      </div>
    </header>
  );
}
