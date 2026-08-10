import type { ComponentType } from "react";
import { Card, Container, Section, SectionHeading } from "@/components";
import {
  IconBook,
  IconCompass,
  IconCrosshair,
  IconDatabase,
  IconFlask,
  IconGrid,
  type IconProps,
} from "@/components/icons";

type Pillar = {
  index: string;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
};

const pillars: Pillar[] = [
  {
    index: "01",
    title: "Player Intelligence",
    description: "Analyze player attributes, roles, strengths and weaknesses.",
    icon: IconCrosshair,
  },
  {
    index: "02",
    title: "Stat Database",
    description: "Explore structured player statistics and performance data.",
    icon: IconDatabase,
  },
  {
    index: "03",
    title: "Coaching",
    description:
      "Learn practical techniques, tactics and systems from expert coaches.",
    icon: IconBook,
  },
  {
    index: "04",
    title: "eFootball Science",
    description:
      "Explore experiments and evidence-based gameplay discoveries.",
    icon: IconFlask,
  },
  {
    index: "05",
    title: "Builds & Formations",
    description:
      "Discover player builds, progression paths and tactical setups.",
    icon: IconGrid,
  },
  {
    index: "06",
    title: "Discoveries",
    description: "Follow new mechanics, findings and community research.",
    icon: IconCompass,
  },
];

export function Pillars() {
  return (
    <Section id="platform" className="scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="The Academy"
          title="Everything you need to understand eFootball."
          description="Six disciplines, one platform — built for players who want to play smarter."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
          {pillars.map((pillar) => (
            <Card key={pillar.index} hover>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-control border border-border bg-card-secondary text-electric">
                  <pillar.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-xs font-bold tracking-widest text-muted/60 tabular-nums">
                  {pillar.index}
                </span>
              </div>
              <h3 className="mt-5 font-display text-display-md font-semibold tracking-wide text-foreground uppercase">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
