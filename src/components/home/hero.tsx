import Link from "next/link";
import { Badge, Button, Container, Section } from "@/components";
import { IconArrowRight, IconPulse } from "@/components/icons";
import { OvrRing } from "@/components/content/attribute-bars";
import { initials } from "@/lib/labels";
import { getFeaturedContent } from "@/lib/public";
import type { Coach, PlayerBuild } from "@/content/types";

export async function Hero() {
  const featured = await getFeaturedContent("featured");
  const entry = featured[0];
  const build = entry?.type === "build" ? entry.content : undefined;
  const attributes = build
    ? Object.entries(build.keyAttributes).slice(0, 5)
    : [];

  return (
    <Section
      as="div"
      className="relative overflow-hidden pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24"
    >
      <div aria-hidden="true" className="absolute inset-0 brand-grid" />
      <div aria-hidden="true" className="absolute inset-0 brand-glow" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-eyebrow font-display text-electric uppercase">
              The Global eFootball Coaching Platform
            </p>
            <h1 className="mt-4 text-display-3xl font-display font-bold text-foreground text-balance">
              Understand the Game.
              <span className="block text-primary">Master Your Players.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted text-pretty sm:text-lg">
              eFootball Academy combines player intelligence, statistical
              analysis, coaching systems and eFootball science to help you make
              better decisions on the pitch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/builds" variant="primary" size="lg">
                Explore the Builds
              </Button>
              <Button href="/coaching" variant="outline" size="lg">
                Explore Coaching
              </Button>
            </div>
          </div>

          {build && (
            <FeaturedBuildPanel build={build} attributes={attributes} />
          )}
          {entry?.type === "coach" && (
            <FeaturedCoachPanel coach={entry.content} />
          )}
        </div>
      </Container>
    </Section>
  );
}

function FeaturedCoachPanel({ coach }: { coach: Coach }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl"
      />
      <div className="relative rounded-card border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-lg font-bold text-electric"
          >
            {initials(coach.name)}
          </span>
          <div>
            <Badge variant="electric">Featured Coach</Badge>
            <p className="mt-2 font-display text-display-lg font-semibold text-foreground">
              {coach.name}
            </p>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">
              Expert Coach
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {coach.specialties.slice(0, 4).map((specialty) => (
            <span
              key={specialty}
              className="rounded-pill border border-border bg-card-secondary px-2.5 py-1 text-[0.6875rem] font-medium text-secondary"
            >
              {specialty}
            </span>
          ))}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-secondary line-clamp-3">
          {coach.bio}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[0.6875rem] leading-relaxed text-muted">
            <IconPulse className="h-3.5 w-3.5 shrink-0 text-electric" />
            Featured by the Academy — full profile and booking on the coach page.
          </p>
          <Link
            href={`/coaching/${coach.slug}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-electric"
          >
            View profile
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedBuildPanel({
  build,
  attributes,
}: {
  build: PlayerBuild;
  attributes: [string, number][];
}) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl"
      />
      <div className="relative rounded-card border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="electric">Featured Build</Badge>
              <span className="text-eyebrow text-muted uppercase">
                {build.position}
              </span>
            </div>
            <p className="mt-4 font-display text-display-lg font-semibold text-foreground">
              {build.playerName}
            </p>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">
              {build.cardName} · {build.buildName}
            </p>
          </div>
          <OvrRing value={build.overall} />
        </div>

        <div className="mt-6 space-y-4">
          {attributes.map(([label, value]) => (
            <div key={label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-medium text-secondary">
                  {label}
                </span>
                <span className="font-display text-xs font-semibold text-electric tabular-nums">
                  {value}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border/60"
              >
                <div
                  className="h-full rounded-full bg-electric"
                  style={{ width: `${Math.min(100, Math.round((value / 101) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[0.6875rem] leading-relaxed text-muted">
            <IconPulse className="h-3.5 w-3.5 shrink-0 text-electric" />
            Featured by the Academy — full statistics on the build page.
          </p>
          <Link
            href={`/builds/${build.slug}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-electric"
          >
            View build
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
