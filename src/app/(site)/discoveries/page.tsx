import type { Metadata } from "next";
import { Container, PageHeader, Section } from "@/components";
import { DiscoveryCard } from "@/components/content/discovery-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { getPublishedDiscoveries } from "@/lib/public";

export const metadata: Metadata = {
  title: "Discoveries | eFootball Academy",
  description:
    "eFootball science, gameplay experiments, mechanics and meta analysis — from the Academy research desk. Example research is always clearly marked.",
};

export const dynamic = "force-dynamic";

export default async function DiscoveriesPage() {
  const discoveries = await getPublishedDiscoveries();

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <PageHeader
            eyebrow="Discoveries"
            title="Test. Measure. Discover."
            description="Experiments, mechanics and meta analysis from the Academy lab and the community. Example research is clearly marked and never presented as verified fact."
          />
        </Container>
      </Section>

      <AdSlot placement="top-banner" className="mt-8" />

      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {discoveries.map((discovery) => (
              <DiscoveryCard key={discovery.id} discovery={discovery} />
            ))}
          </div>
        </Container>
      </Section>

      <AdSlot placement="before-footer" />
    </>
  );
}
