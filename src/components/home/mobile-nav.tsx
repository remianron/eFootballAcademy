"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Container, IconButton } from "@/components";
import { IconChevronRight, IconClose, IconMenu } from "@/components/icons";

export type NavLink = { label: string; href: string };

type MobileNavProps = {
  links: readonly NavLink[];
};

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <IconButton
        label={open ? "Close menu" : "Open menu"}
        variant="outline"
        size="sm"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <IconClose className="h-5 w-5" />
        ) : (
          <IconMenu className="h-5 w-5" />
        )}
      </IconButton>

      {open && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-16 z-50 border-b border-border bg-background/95 shadow-card backdrop-blur-md"
        >
          <Container className="py-4">
            <nav aria-label="Mobile">
              <ul className="flex flex-col divide-y divide-border">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3 text-sm font-medium text-secondary transition-colors hover:text-electric"
                    >
                      {link.label}
                      <IconChevronRight className="h-4 w-4 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Button
                  href="#platform"
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Explore Academy
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </div>
  );
}
