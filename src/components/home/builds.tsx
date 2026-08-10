import type { ComponentType } from "react";
import { Card, Container, Section, SectionHeading } from "@/components";
import {
  IconFormation,
  IconSliders,
  IconStar,
  IconTrendUp,
  type IconProps,
} from "@/components/icons";

type Build = {
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
};

const builds: Build[] = [
  {
    title: "Player Builds",
    description: "Stat-focused builds for every playstyle and budget.",
    icon: IconSliders,
  },
  {
    title: "Formations",
    description: "Tactical setups mapped to roles and game plans.",
    icon: IconFormation,
  },
  {
    title: "Progression Guides",
    description: "Step-by-step paths to upgrade and optimize your squad.",
    icon: IconTrendUp,
  },
  {
    title: "Role Optimization",
    description: "Find the best role for every player you own.",
    icon: IconStar,
  },
];

export function Builds() {
  return (
    <Section id="builds" className="scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Builds & Formations"
          title="Build your perfect setup."
          description="Player builds, formations, progression guides and role optimization — structured tools to shape your squad and your style."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:mt-12">
          {builds.map((build, index) => (
            <Card key={build.title} hover className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-control border border-border bg-card-secondary text-electric">
                  <build.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-xs font-bold tracking-widest text-muted/60 tabular-nums">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-display-md font-semibold tracking-wide text-foreground uppercase">
                {build.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {build.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
