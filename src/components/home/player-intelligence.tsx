import { Badge, Card, Container, Section, SectionHeading } from "@/components";

const dimensions = [
  "Attributes and attribute composition",
  "Playstyles and special traits",
  "Roles and position fit",
  "Builds and progression paths",
  "Practical gameplay performance",
] as const;

const playstyles = ["Creative Playmaker", "Hole Player"] as const;

const strengths = [
  "First-touch control",
  "Through-ball vision",
  "Weak-foot finishing",
] as const;

const weaknesses = ["Physical duels", "Defensive work rate"] as const;

export function PlayerIntelligence() {
  return (
    <Section id="players" className="scroll-mt-20">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Player Intelligence"
              title="More than a player rating."
              description="The Academy will evaluate players through attributes, playstyles, roles, builds and practical gameplay performance — not just a single number."
            />
            <ul className="mt-8 space-y-3">
              {dimensions.map((dimension) => (
                <li
                  key={dimension}
                  className="flex items-center gap-3 text-sm text-secondary"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric"
                  />
                  {dimension}
                </li>
              ))}
            </ul>
          </div>

          <ExamplePlayerCard />
        </div>
      </Container>
    </Section>
  );
}

function ExamplePlayerCard() {
  return (
    <Card className="lg:ml-auto lg:max-w-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-lg font-bold text-electric"
          >
            AM
          </span>
          <div>
            <p className="font-display text-display-md font-semibold text-foreground">
              A. Meridian
            </p>
            <p className="mt-1 text-xs tracking-widest text-muted uppercase">
              Attacking Midfielder
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-stat font-bold text-gold tabular-nums">
            92
          </p>
          <p className="text-[0.625rem] font-medium tracking-[0.2em] text-muted uppercase">
            OVR
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5 border-t border-border pt-5">
        <div>
          <p className="text-eyebrow text-muted uppercase">Playstyle</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {playstyles.map((playstyle) => (
              <span
                key={playstyle}
                className="rounded-pill border border-electric/40 bg-electric/10 px-2.5 py-1 text-[0.6875rem] font-medium text-electric"
              >
                {playstyle}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-eyebrow text-muted uppercase">Role</p>
          <p className="mt-2 text-sm text-secondary">
            AMF — attacking midfield playmaker in a 4-2-1-3 (example setup)
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-eyebrow text-muted uppercase">Strengths</p>
            <ul className="mt-2 space-y-2">
              {strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-2 text-sm text-secondary">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-eyebrow text-muted uppercase">Weaknesses</p>
            <ul className="mt-2 space-y-2">
              {weaknesses.map((weakness) => (
                <li key={weakness} className="flex items-start gap-2 text-sm text-secondary">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-border pt-4 text-[0.6875rem] text-muted">
        <Badge variant="neutral" className="mr-2">
          Example
        </Badge>
        Fictional profile shown for demonstration only.
      </p>
    </Card>
  );
}
