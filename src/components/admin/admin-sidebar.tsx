"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/brand/brand-logo";
import { IconButton } from "@/components/ui/icon-button";
import { IconClose, IconMenu } from "@/components/icons";
import {
  ADMIN_NAV_ITEMS,
  isAdminNavActive,
} from "@/components/admin/admin-nav";

/**
 * Admin navigation. Fixed drawer on mobile (toggled from the top bar),
 * static sidebar column on desktop.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
        <BrandLogo mode="full" />
        <IconButton
          label="Open admin navigation"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <IconMenu className="h-5 w-5" />
        </IconButton>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background",
          "transition-transform duration-150",
          "lg:static lg:z-auto lg:w-56 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <BrandLogo mode="full" />
          <IconButton
            label="Close admin navigation"
            size="sm"
            onClick={() => setOpen(false)}
            className="lg:hidden"
          >
            <IconClose className="h-5 w-5" />
          </IconButton>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin sections">
          <p className="px-3 pb-2 text-[0.6875rem] font-semibold tracking-widest text-muted uppercase">
            Content
          </p>
          <ul className="space-y-1">
            {ADMIN_NAV_ITEMS.map(({ href, label, icon: NavIcon }) => {
              const active = isAdminNavActive(href, pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium",
                      "transition-colors duration-150",
                      active
                        ? "bg-primary/10 text-electric"
                        : "text-secondary hover:bg-card-secondary hover:text-foreground"
                    )}
                  >
                    <NavIcon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <div className="rounded-control bg-card px-3 py-2.5">
            <p className="text-[0.6875rem] font-semibold tracking-widest text-gold uppercase">
              Development preview
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              No authentication yet. This area establishes the content
              management foundation.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
