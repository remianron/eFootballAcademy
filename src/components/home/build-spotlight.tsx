import { Badge, Button, Container, Section, SectionHeading } from "@/components";
import { StatBars } from "@/components/content/attribute-bars";
import { MediaPlaceholder } from "@/components/content/media-placeholder";
import { getFeaturedContent } from "@/lib/content";

export async function BuildSpotlight() {
  const featured = await getFeaturedContent("featured");
  const build = featured.find((entry) => entry.type === "build")?.content;
  if (!build) return null;

  return (
    <Section className="border-y border-border bg-card/60">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured Build"
            title={build.title}
            description="Every build on eFootball Academy is analyzed by our coaches — the philosophy behind it, the attributes that matter for it, and where it plays best."
          />
          <div className="flex gap-2">
            <Badge variant="neutral">{build.position}</Badge>
            <Badge variant="electric">{build.buildName}</Badge>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12 sm:mt-12">
          <div className="flex flex-col gap-4">
            <MediaPlaceholder
              label={`${build.playerName} card`}
              className="aspect-[16/9] w-full"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-display-lg font-semibold text-foreground">
                  {build.playerName}
                </p>
                <p className="mt-1 text-xs tracking-widest text-muted uppercase">
                  {build.cardName}
                </p>
              </div>
              <p className="font-display text-stat font-bold text-gold tabular-nums">
                {build.overall}
                <span className="ml-1 text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  OVR
                </span>
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {build.shortDescription}
            </p>
          </div>

          <div className="flex flex-col">
            <StatBars
              attributes={build.keyAttributes}
              className="mt-0"
            />

            <div className="mt-6 space-y-2">
              {build.strengths.map((strength) => (
                <p key={strength} className="flex items-start gap-2 text-sm text-secondary">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-success" />
                  {strength}
                </p>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Button href={`/builds/${build.slug}`} variant="primary">
                Read the Full Build
              </Button>
              <Button href="/builds" variant="outline">
                All Builds
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
