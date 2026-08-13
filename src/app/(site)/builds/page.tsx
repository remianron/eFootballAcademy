import type { Metadata } from "next";
import { Badge, Container, PageHeader, Section } from "@/components";
import { BuildCard } from "@/components/content/build-card";
import { getPublishedBuilds } from "@/lib/public";

export const metadata: Metadata = {
  title: "Player Builds | eFootball Academy",
  description:
    "Curated player builds with full statistics, strengths and weaknesses — analyzed and published by eFootball Academy coaches.",
};

export const dynamic = "force-dynamic";

export default async function BuildsPage() {
  const builds = await getPublishedBuilds();

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <PageHeader
            eyebrow="Player Builds"
            title="Builds we have studied."
            description="eFootball Academy is a curated platform — we publish builds only for players we have analyzed in depth, with complete statistics for every build."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="neutral">Curated, not complete</Badge>
            <Badge variant="neutral">Multiple builds per card</Badge>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {builds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
