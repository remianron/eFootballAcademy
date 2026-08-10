import type { ComponentType } from "react";
import { Badge, Card, Container, Section, SectionHeading } from "@/components";
import {
  IconArrowRight,
  IconDribble,
  IconPulse,
  IconSliders,
  IconTarget,
  type IconProps,
} from "@/components/icons";

type Discovery = {
  category: string;
  title: string;
  excerpt: string;
  icon: ComponentType<IconProps>;
};

const discoveries: Discovery[] = [
  {
    category: "Mechanics",
    title: "New Dribbling Interaction Tested",
    excerpt:
      "Controlled dribbling tests explore how input timing and direction changes behave under pressure.",
    icon: IconDribble,
  },
  {
    category: "Finishing",
    title: "Finishing Threshold Experiment",
    excerpt:
      "A first pass at identifying which finishing attributes matter most inside the box.",
    icon: IconTarget,
  },
  {
    category: "Meta Analysis",
    title: "Best Attributes for Fast Counter Attacks",
    excerpt:
      "Community breakdown of attribute priorities for quick transitions and vertical attacks.",
    icon: IconPulse,
  },
  {
    category: "Builds",
    title: "New Build Optimization Method",
    excerpt:
      "A structured approach to optimizing builds without wasting progression points.",
    icon: IconSliders,
  },
];

export function Discoveries() {
  return (
    <Section id="discoveries" className="scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Latest Discoveries"
          title="Fresh findings from the community."
          description="Notes from Academy experiments and community research. Everything here is example material until published."
        />
        <Card className="mt-10 sm:mt-12">
          <ul className="divide-y divide-border">
            {discoveries.map((discovery) => (
              <li
                key={discovery.title}
                className="group flex flex-col gap-4 px-1 py-5 transition-colors hover:bg-card-secondary/40 sm:flex-row sm:items-center sm:px-2"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-border bg-card-secondary text-electric">
                  <discovery.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="warning">Example</Badge>
                    <span className="text-eyebrow text-muted uppercase">
                      {discovery.category}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-display text-display-md font-semibold text-foreground">
                    {discovery.title}
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
                    {discovery.excerpt}
                  </p>
                </div>
                <IconArrowRight className="hidden h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-electric sm:block" />
              </li>
            ))}
          </ul>
        </Card>
      </Container>
    </Section>
  );
}
