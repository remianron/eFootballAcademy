"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { BrandLogo, Button, Container } from "@/components";
import { isSectionActive, MobileNav } from "@/components/home/mobile-nav";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Builds", href: "/builds" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Formations", href: "/formations" },
  { label: "Coaching", href: "/coaching" },
  { label: "Discoveries", href: "/discoveries" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative sticky top-0 z-50 border-b border-border bg-navy/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="eFootball Academy home" className="shrink-0">
          <BrandLogo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isSectionActive(link.href, pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  "after:absolute after:-bottom-2 after:inset-x-1 after:h-0.5 after:origin-center after:rounded-full after:bg-electric after:transition-transform after:duration-150",
                  active
                    ? "text-electric after:scale-x-100"
                    : "text-secondary after:scale-x-0 hover:text-electric hover:after:scale-x-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 sm:flex">
          <Button href="/builds" variant="primary" size="sm">
            Explore Builds
          </Button>
        </div>

        <MobileNav links={NAV_LINKS} />
      </Container>
    </header>
  );
}
