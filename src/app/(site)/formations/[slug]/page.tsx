import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Card, Container, Section } from "@/components";
import { ContentMediaList } from "@/components/content/content-media";
import { ContentBlockList } from "@/components/content/content-blocks";
import { MediaPlaceholder } from "@/components/content/media-placeholder";
import { AdSlot } from "@/components/ads/ad-slot";
import { IconTarget } from "@/components/icons";
import { getPublishedFormationBySlug } from "@/lib/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/formations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const formation = await getPublishedFormationBySlug(slug);
  if (!formation) {
    return { title: "Formation guide not found | eFootball Academy" };
  }
  return {
    title: `${formation.title} | eFootball Academy`,
    description: formation.description,
  };
}

export default async function FormationPage({
  params,
}: PageProps<"/formations/[slug]">) {
  const { slug } = await params;
  const formation = await getPublishedFormationBySlug(slug);
  if (!formation) notFound();

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{formation.formation}</Badge>
            <Badge variant="electric">{formation.playstyle}</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-display-2xl font-display font-bold text-foreground text-balance">
            {formation.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted text-pretty sm:text-lg">
            {formation.description}
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {formation.media && formation.media.length > 0 ? (
            <ContentMediaList media={formation.media} />
          ) : (
            <MediaPlaceholder
              label={`${formation.formation} formation diagram`}
              className="aspect-[16/9] w-full lg:aspect-[21/9]"
            />
          )}

          <ContentBlockList blocks={formation.blocks} className="mt-12" />

          <AdSlot placement="content-inline" className="mt-12" />

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="font-display text-display-lg font-semibold text-foreground">
                Player Roles
              </h2>
              <div className="mt-5 space-y-3">
                {formation.playerRoles.map((role) => (
                  <Card key={role.position} padded={false} className="flex items-start gap-4 p-4">
                    <span className="mt-0.5 flex h-7 w-16 shrink-0 items-center justify-center rounded-control border border-electric/40 bg-electric/10 font-display text-xs font-bold text-electric">
                      {role.position}
                    </span>
                    <p className="text-sm leading-relaxed text-secondary">
                      {role.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-display-lg font-semibold text-foreground">
                Tactical Instructions
              </h2>
              <ol className="mt-5 space-y-4">
                {formation.tacticalInstructions.map((instruction, index) => (
                  <li
                    key={instruction}
                    className="flex items-start gap-4 text-sm leading-relaxed text-secondary"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control border border-electric/40 bg-electric/10 font-display text-xs font-bold text-electric tabular-nums">
                      {index + 1}
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="font-display text-display-md font-semibold text-foreground">
                Strengths
              </h2>
              <ul className="mt-4 space-y-3">
                {formation.strengths.map((strength) => (
                  <li
                    key={strength}
                    className="flex items-start gap-3 text-sm leading-relaxed text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success"
                    />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-display-md font-semibold text-foreground">
                Weaknesses
              </h2>
              <ul className="mt-4 space-y-3">
                {formation.weaknesses.map((weakness) => (
                  <li
                    key={weakness}
                    className="flex items-start gap-3 text-sm leading-relaxed text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning"
                    />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <AdSlot placement="before-related" className="mt-12" />

          <div className="mt-12 rounded-card border border-primary/40 bg-primary/10 p-6 shadow-elevated sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-primary/40 bg-card text-electric">
                <IconTarget className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-display-md font-semibold text-foreground">
                  When to Use This Formation
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-secondary">
                  {formation.recommendedUsage}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
