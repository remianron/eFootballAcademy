import { Badge, Button, Container, Section } from "@/components";
import { IconPulse } from "@/components/icons";

const attributes = [
  { label: "Finishing", value: 88 },
  { label: "Speed", value: 94 },
  { label: "Acceleration", value: 93 },
  { label: "Balance", value: 90 },
  { label: "Physical Contact", value: 91 },
] as const;

const OVR = 92;
const RING_RADIUS = 40;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function Hero() {
  return (
    <Section as="div" className="overflow-hidden pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <Container>
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
              <Button href="#platform" variant="primary" size="lg">
                Explore the Academy
              </Button>
              <Button href="#players" variant="outline" size="lg">
                Explore Player Database
              </Button>
            </div>
          </div>

          <PlayerPanel />
        </div>
      </Container>
    </Section>
  );
}

function PlayerPanel() {
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
              <Badge variant="electric">Example Data</Badge>
              <span className="text-eyebrow text-muted uppercase">
                Player Panel
              </span>
            </div>
            <p className="mt-4 font-display text-display-lg font-semibold text-foreground">
              A. Meridian
            </p>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">
              Attacking Midfielder · Example
            </p>
          </div>
          <OvrRing />
        </div>

        <div className="mt-6 space-y-4">
          {attributes.map((attribute) => (
            <AttributeBar key={attribute.label} {...attribute} />
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 text-[0.6875rem] leading-relaxed text-muted">
          <IconPulse className="h-3.5 w-3.5 shrink-0 text-electric" />
          Example metrics only — not a real player profile.
        </p>
      </div>
    </div>
  );
}

function OvrRing() {
  const progress = OVR / 99;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 96 96" className="h-20 w-20 -rotate-90" aria-hidden="true">
        <circle
          cx="48"
          cy="48"
          r={RING_RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r={RING_RADIUS}
          fill="none"
          stroke="var(--color-electric)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${RING_CIRCUMFERENCE * progress} ${RING_CIRCUMFERENCE}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-bold text-foreground tabular-nums">
          {OVR}
        </span>
        <span className="text-[0.625rem] font-medium tracking-[0.2em] text-gold uppercase">
          OVR
        </span>
      </div>
    </div>
  );
}

function AttributeBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-secondary">{label}</span>
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
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
