import {
  Badge,
  BrandLogo,
  Button,
  Card,
  Container,
  Divider,
  PageHeader,
  Section,
  SectionHeading,
} from "@/components";

const pillars = [
  {
    index: "01",
    title: "Player Intelligence",
    description:
      "Deep-dive player analysis, reviews and progression mapping for competitive eFootball.",
  },
  {
    index: "02",
    title: "Statistical Analysis",
    description:
      "Data-driven evaluation of players, builds and match performance.",
  },
  {
    index: "03",
    title: "Training Systems",
    description:
      "Structured training methods built on eFootball science and modern coaching practice.",
  },
  {
    index: "04",
    title: "Tactics & Formations",
    description:
      "Formation frameworks, tactical systems and game plan studies.",
  },
  {
    index: "05",
    title: "Builds & Reviews",
    description:
      "Expert player builds and honest reviews to guide your roster decisions.",
  },
  {
    index: "06",
    title: "Community Discoveries",
    description:
      "Experiments and discoveries shared by a global coaching community.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <Container className="flex h-16 items-center justify-between">
          <BrandLogo />
          <Button href="#" variant="outline" size="sm">
            Get Started
          </Button>
        </Container>
      </header>

      <main className="flex-1">
        <Section as="div" className="pb-10 sm:pb-12">
          <Container>
            <PageHeader
              eyebrow="Global eFootball Coaching Platform"
              title="Learn. Train. Master."
              description="eFootball Academy is a global eFootball coaching and intelligence platform combining player intelligence, statistical analysis, eFootball science, training systems and expert coaching."
              actions={
                <>
                  <Button href="#" variant="primary">
                    Explore the Platform
                  </Button>
                  <Button href="#" variant="outline">
                    View Documentation
                  </Button>
                </>
              }
            />
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="mb-10 flex flex-wrap items-center gap-2 sm:mb-12">
              <Badge variant="gold">Phase 1</Badge>
              <Badge variant="primary">Brand &amp; Design System</Badge>
              <Badge variant="neutral">Foundations</Badge>
            </div>
            <SectionHeading
              eyebrow="Platform"
              title="Built on six disciplines"
              description="Every module of the platform is built on a foundation of analytics, coaching and eFootball science."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
              {pillars.map((pillar) => (
                <Card key={pillar.index} hover>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold tracking-widest text-electric tabular-nums">
                      {pillar.index}
                    </span>
                    <span className="h-px w-8 bg-border" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-display-md font-display font-semibold text-foreground">
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
      </main>

      <footer className="border-t border-border">
        <Container className="flex h-16 items-center justify-between">
          <BrandLogo mode="compact" />
          <Divider className="mx-6 hidden flex-1 sm:flex" />
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} eFootball Academy. Learn • Train •
            Master.
          </p>
        </Container>
      </footer>
    </div>
  );
}
