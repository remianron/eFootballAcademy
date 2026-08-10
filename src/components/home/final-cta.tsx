import { Button, Container, Section } from "@/components";

export function FinalCta() {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-card border border-primary/40 bg-primary/10 px-6 py-14 text-center shadow-elevated sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(0, 102, 255, 0.18), transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-eyebrow font-display text-electric uppercase">
              The Academy
            </p>
            <h2 className="mt-3 text-display-2xl font-display font-bold text-foreground text-balance">
              Ready to understand eFootball differently?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted text-pretty sm:text-lg">
              Explore players, train smarter and discover what actually works.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="#platform" variant="primary" size="lg">
                Explore the Academy
              </Button>
              <Button href="#players" variant="outline" size="lg">
                View Player Database
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
