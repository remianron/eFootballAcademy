import { Button, Container, Section, SectionHeading } from "@/components";
import { CoachCard } from "@/components/content/coach-card";
import { getFeaturedContent } from "@/lib/content";

export async function CoachesSection() {
  const featured = await getFeaturedContent("featured");
  const coaches = featured
    .filter((entry) => entry.type === "coach")
    .map((entry) => entry.content);

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Expert Coaches"
            title="Learn from experienced eFootball coaches."
            description="Public coaching profiles — booking and sessions arrive in a later phase."
          />
          <Button href="/coaching" variant="outline" size="sm">
            All Coaches
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
