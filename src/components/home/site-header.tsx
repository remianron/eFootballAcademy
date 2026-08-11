import Link from "next/link";
import { BrandLogo, Button, Container } from "@/components";
import { MobileNav } from "@/components/home/mobile-nav";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Builds", href: "/builds" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Formations", href: "/formations" },
  { label: "Coaching", href: "/coaching" },
  { label: "Discoveries", href: "/discoveries" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="eFootball Academy home" className="shrink-0">
          <BrandLogo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-secondary transition-colors hover:text-electric"
            >
              {link.label}
            </Link>
          ))}
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
