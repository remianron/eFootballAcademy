"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button, Container, IconButton } from "@/components";
import { IconChevronRight, IconClose, IconMenu } from "@/components/icons";

export type NavLink = { label: string; href: string };

export function isSectionActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type MobileNavProps = {
  links: readonly NavLink[];
};

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target)) {
        event.preventDefault();
        setOpen(false);
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="lg:hidden">
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
          className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto bg-background"
        >
          <Container className="py-4">
            <nav aria-label="Mobile">
              <ul className="flex flex-col divide-y divide-border">
                {links.map((link) => {
                  const active = isSectionActive(link.href, pathname);
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between py-3 text-sm font-medium transition-colors",
                          active
                            ? "text-electric"
                            : "text-secondary hover:text-electric"
                        )}
                      >
                        {link.label}
                        <IconChevronRight
                          className={cn(
                            "h-4 w-4",
                            active ? "text-electric" : "text-muted"
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4">
                <Button
                  href="/builds"
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Explore Builds
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </div>
  );
}