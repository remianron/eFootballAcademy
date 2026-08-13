import { Button, Container, Section, SectionHeading } from "@/components";
import { DiscoveryCard } from "@/components/content/discovery-card";
import { getFeaturedContent } from "@/lib/public";

export async function DiscoveriesSection() {
  const [featured, latest] = await Promise.all([
    getFeaturedContent("featured"),
    getFeaturedContent("latest"),
  ]);
  const discoveries = [
    ...featured
      .filter((entry) => entry.type === "discovery")
      .map((entry) => entry.content),
    ...latest
      .filter((entry) => entry.type === "discovery")
      .map((entry) => entry.content),
  ].slice(0, 2);

  return (
    <Section className="border-y border-border bg-card">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Discoveries"
            title="Test. Measure. Discover."
            description="Experiments, mechanics and meta analysis from the Academy lab. Example research is always clearly marked."
          />
          <Button href="/discoveries" variant="outline" size="sm">
            All Discoveries
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:mt-12">
          {discoveries.map((discovery) => (
            <DiscoveryCard key={discovery.id} discovery={discovery} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
