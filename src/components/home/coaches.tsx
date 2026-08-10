import { Card, Container, Section, SectionHeading } from "@/components";

type Coach = {
  name: string;
  initials: string;
  focus: readonly string[];
};

const coaches: Coach[] = [
  {
    name: "RemianRon",
    initials: "RR",
    focus: ["Advanced Mechanics", "Free Kicks", "Dribbling", "Player Builds"],
  },
  {
    name: "Julian Cross",
    initials: "JC",
    focus: ["Passing", "Build-Up Play", "Vision", "Possession"],
  },
  {
    name: "Elena Ortiz",
    initials: "EO",
    focus: ["Finishing", "Positioning", "Shooting Technique", "Off-Ball Movement"],
  },
];

export function Coaches() {
  return (
    <Section id="coaches" className="scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Expert Coaches"
          title="Learn from experienced eFootball coaches."
          description="The Academy coaching profile system will bring in coaches with practical, playable expertise. Profiles below are example placeholders."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
          {coaches.map((coach) => (
            <Card key={coach.name} hover className="flex flex-col">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-lg font-bold text-electric"
                >
                  {coach.initials}
                </span>
                <div>
                  <h3 className="font-display text-display-md font-semibold text-foreground">
                    {coach.name}
                  </h3>
                  <p className="mt-1 text-xs tracking-widest text-muted uppercase">
                    Expert Coach
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {coach.focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-pill border border-border bg-card-secondary px-2.5 py-1 text-[0.6875rem] font-medium text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-auto pt-5 text-[0.6875rem] text-muted">
                Example profile
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
