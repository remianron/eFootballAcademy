import type { ComponentType } from "react";
import { Badge, Card, Container, Section, SectionHeading } from "@/components";
import {
  IconFlask,
  IconPulse,
  IconTarget,
  IconUsers,
  type IconProps,
} from "@/components/icons";

type Experiment = {
  question: string;
  icon: ComponentType<IconProps>;
};

const experiments: Experiment[] = [
  {
    question: "Does acceleration actually improve first-step burst?",
    icon: IconPulse,
  },
  {
    question: "How does balance affect tight dribbling?",
    icon: IconUsers,
  },
  {
    question: "Does player height affect aerial effectiveness?",
    icon: IconTarget,
  },
  {
    question: "Which finishing attributes matter most?",
    icon: IconFlask,
  },
];

export function Science() {
  return (
    <Section
      id="experiments"
      className="relative scroll-mt-20 overflow-hidden border-y border-border bg-card"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "2.5rem 2.5rem",
        }}
      />
      <Container className="relative">
        <SectionHeading
          align="center"
          eyebrow="eFootball Science"
          title="Test. Measure. Discover."
          description="The Academy will investigate gameplay mechanics through controlled experiments — repeatable tests, field notes and shared findings."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:mt-12">
          {experiments.map((experiment) => (
            <Card
              key={experiment.question}
              className="border-dashed bg-card-secondary/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-control border border-border bg-card text-electric">
                  <experiment.icon className="h-5 w-5" />
                </span>
                <Badge variant="purple">Example Research</Badge>
              </div>
              <p className="mt-4 font-display text-display-md leading-snug font-semibold text-foreground">
                “{experiment.question}”
              </p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-xs leading-relaxed text-muted">
          Example research questions only — these results are not
          scientifically verified.
        </p>
      </Container>
    </Section>
  );
}
