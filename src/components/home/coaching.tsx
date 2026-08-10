import type { ComponentType } from "react";
import { Button, Card, Container, Section, SectionHeading } from "@/components";
import {
  IconDribble,
  IconPass,
  IconTarget,
  type IconProps,
} from "@/components/icons";

type Module = {
  index: string;
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
};

const modules: Module[] = [
  {
    index: "01",
    title: "Dribbling",
    description:
      "Improve ball control, direction changes and 1v1 movement.",
    icon: IconDribble,
  },
  {
    index: "02",
    title: "Passing",
    description:
      "Understand timing, angles and passing decisions.",
    icon: IconPass,
  },
  {
    index: "03",
    title: "Finishing",
    description:
      "Improve shot selection, positioning and finishing techniques.",
    icon: IconTarget,
  },
];

export function Coaching() {
  return (
    <Section id="coaching" className="scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Coaching"
          title="Learn how better players think."
          description="The Academy coaching system breaks play into modules — techniques, decisions and habits, explained by experienced coaches."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
          {modules.map((module) => (
            <Card key={module.title} hover>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-control border border-border bg-card-secondary text-electric">
                  <module.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-xs font-bold tracking-widest text-muted/60 tabular-nums">
                  Module {module.index}
                </span>
              </div>
              <h3 className="mt-5 font-display text-display-md font-semibold tracking-wide text-foreground uppercase">
                {module.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {module.description}
              </p>
            </Card>
          ))}
        </div>
        <div className="mt-10 sm:mt-12">
          <Button href="#" variant="primary">
            Explore Coaching
          </Button>
        </div>
      </Container>
    </Section>
  );
}
