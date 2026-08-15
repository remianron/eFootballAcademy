import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Container, Divider, Section } from "@/components";
import { OvrRing, StatBars } from "@/components/content/attribute-bars";
import { BuildSwitcher } from "@/components/content/build-switcher";
import { ContentMediaList } from "@/components/content/content-media";
import { ContentBlockList } from "@/components/content/content-blocks";
import { CommunityFeedbackList } from "@/components/content/community-feedback";
import { AdSlot } from "@/components/ads/ad-slot";
import { cn } from "@/lib/cn";
import {
  getPublishedBuildBySlug,
  getPublishedBuildsForCard,
} from "@/lib/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/builds/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const build = await getPublishedBuildBySlug(slug);
  if (!build) {
    return { title: "Build not found | eFootball Academy" };
  }
  return {
    title: `${build.playerName} — ${build.buildName} | eFootball Academy`,
    description: build.shortDescription,
  };
}

export default async function BuildPage({
  params,
}: PageProps<"/builds/[slug]">) {
  const { slug } = await params;
  const build = await getPublishedBuildBySlug(slug);
  if (!build) notFound();

  const cardBuilds = await getPublishedBuildsForCard(
    build.playerName,
    build.cardName
  );
  const showSwitcher = cardBuilds.length > 1;

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-eyebrow font-display text-electric uppercase">
                Player Build
              </p>
              <h1 className="mt-3 text-display-2xl font-display font-bold text-foreground text-balance">
                {build.playerName}
              </h1>
              <p className="mt-2 text-xs tracking-widest text-muted uppercase">
                {build.cardName} · {build.position}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="neutral">{build.position}</Badge>
                <span className="rounded-pill border border-electric/40 bg-electric/10 px-2.5 py-0.5 text-[0.6875rem] font-medium text-electric">
                  {build.buildName}
                </span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted text-pretty">
                {build.shortDescription}
              </p>
            </div>
            <OvrRing value={build.overall} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <AdSlot placement="top-banner" className="mb-12" />

          {showSwitcher && (
            <div className="rounded-card border border-border bg-card p-5 sm:p-6">
              <BuildSwitcher
                cardName={`${build.cardName} · ${build.position}`}
                builds={cardBuilds}
                activeSlug={build.slug}
              />
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Each build trades different attributes. Review both before you
                decide — neither is universally better.
              </p>
            </div>
          )}

          <div className={cn("space-y-12", showSwitcher ? "mt-12" : "mt-2")}>
            {build.media && build.media.length > 0 && (
              <section>
                <SectionLabel label="Build Media" title="See the build in action." />
                <ContentMediaList media={build.media} />
              </section>
            )}

            <section>
              <Divider className="mb-8" />
              <SectionLabel label="Build Philosophy" title="Why this build exists." />
              <div className="mt-5 rounded-card border border-border border-l-2 border-l-electric bg-card p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-secondary sm:text-base">
                  {build.philosophy}
                </p>
              </div>
              <ContentBlockList blocks={build.blocks} className="mt-10" />
            </section>

            <AdSlot placement="content-inline" />

            <section>
              <Divider className="mb-8" />
              <SectionLabel
                label="Key Attributes"
                title="The attributes that define this build."
              />
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted">
                Key attributes shown for this build. Full training allocation
                is provided in the build media.
              </p>
              <StatBars attributes={build.keyAttributes} className="mt-6" />
              {build.skills && build.skills.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-eyebrow text-muted uppercase">Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {build.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-pill border border-border bg-card-secondary px-2.5 py-1 text-[0.6875rem] font-medium text-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section>
              <Divider className="mb-8" />
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
                <div>
                  <SectionLabel label="Strengths" title="Where this build wins." />
                  <ul className="mt-5 space-y-3">
                    {build.strengths.map((strength) => (
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
                  <SectionLabel
                    label="Weaknesses"
                    title="Where this build gives ground."
                  />
                  <ul className="mt-5 space-y-3">
                    {build.weaknesses.map((weakness) => (
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
            </section>

            <section>
              <Divider className="mb-8" />
              <SectionLabel label="Recommended Use" title="Where it plays best." />
              <div className="mt-5 grid gap-8 sm:grid-cols-2 lg:gap-12">
                <div>
                  <h3 className="text-eyebrow text-electric uppercase">
                    Recommended for
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {build.recommendedFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-eyebrow text-warning uppercase">Avoid</h3>
                  <ul className="mt-4 space-y-3">
                    {build.avoidFor.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-relaxed text-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <AdSlot placement="before-related" />

            <section>
              <Divider className="mb-8" />
              <SectionLabel
                label="Community Feedback"
                title="What the community says."
              />
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted">
                Community opinions about this build — not official Academy
                claims. Feedback shown here is example data.
              </p>
              <div className="mt-6">
                <CommunityFeedbackList
                  feedback={build.communityFeedback ?? []}
                />
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </>
  );
}

function SectionLabel({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="text-eyebrow font-display text-electric uppercase">
        {label}
      </p>
      <h2 className="mt-2 font-display text-display-lg font-semibold text-foreground">
        {title}
      </h2>
    </div>
  );
}
