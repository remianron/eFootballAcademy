import { BrandLogo, Container, Divider } from "@/components";
import type { SiteSocialLink } from "@/content/types";

const platformLinks = [
  { label: "Builds", href: "/builds" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Formations", href: "/formations" },
  { label: "Coaching", href: "/coaching" },
  { label: "Discoveries", href: "/discoveries" },
] as const;

const aboutLinks = [
  { label: "About Academy", href: "#" },
  { label: "Expert Coaches", href: "/coaching" },
  { label: "Research", href: "/discoveries" },
] as const;

export function SiteFooter({ socialLinks }: { socialLinks: SiteSocialLink[] }) {
  return (
    <footer className="border-t border-border bg-navy">
      <div
        aria-hidden="true"
        className="h-px bg-gradient-to-r from-transparent via-electric/60 to-transparent"
      />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo />
            <div className="mt-4 flex items-center gap-3">
              <span aria-hidden="true" className="accent-line-gold" />
              <p className="font-display text-xs font-semibold tracking-[0.25em] text-secondary uppercase">
                Learn · Train · Master
              </p>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
              eFootball Academy is a curated coaching and intelligence platform
              — published builds, tutorials, formations and research.
            </p>
          </div>
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="About" links={aboutLinks} />
          <FooterColumn title="Social" links={socialLinks.map((link) => ({ label: link.label, href: link.url }))} />
        </div>

        <Divider className="mt-12" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} eFootball Academy. Learn • Train •
            Master.
          </p>
          <p className="text-xs text-muted/60">
            Built on the Academy design system.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-eyebrow font-display text-muted uppercase">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-secondary transition-colors hover:text-electric"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
