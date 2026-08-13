import type { Metadata } from "next";
import { Badge, Container, PageHeader, Section } from "@/components";
import { CoachCard } from "@/components/content/coach-card";
import { getPublishedCoaches } from "@/lib/public";

export const metadata: Metadata = {
  title: "Coaching | eFootball Academy",
  description:
    "Public profiles of eFootball Academy expert coaches — specialties, coaching focus and how they can help you play smarter.",
};

export const dynamic = "force-dynamic";

export default async function CoachingPage() {
  const coaches = await getPublishedCoaches();

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <PageHeader
            eyebrow="Coaching"
            title="Learn from experienced eFootball coaches."
            description="Coaching profiles are public. Request a coaching session directly from a coach's profile — scheduling and payment are arranged directly with the coach."
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="neutral">Public profiles only</Badge>
            <Badge variant="neutral">Book a session</Badge>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
