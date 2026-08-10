import { BrandLogo, Container, Divider } from "@/components";

const platformLinks = [
  { label: "Players", href: "#players" },
  { label: "Stats", href: "#platform" },
  { label: "Coaching", href: "#coaching" },
  { label: "Experiments", href: "#experiments" },
  { label: "Builds", href: "#builds" },
  { label: "Discoveries", href: "#discoveries" },
] as const;

const aboutLinks = [
  { label: "About Academy", href: "#" },
  { label: "Expert Coaches", href: "#coaches" },
  { label: "Research", href: "#experiments" },
] as const;

const socialLinks = [
  { label: "YouTube", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 text-sm font-medium text-secondary">
              Learn. Train. Master.
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">
              eFootball Academy is a global coaching and intelligence platform
              for players, coaches and researchers.
            </p>
          </div>
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="About" links={aboutLinks} />
          <FooterColumn title="Social" links={socialLinks} />
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
