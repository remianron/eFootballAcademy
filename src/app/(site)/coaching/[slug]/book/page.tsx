import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Container, Section } from "@/components";
import { BookingRequestForm } from "@/components/booking/booking-request-form";
import { getPublishedCoachBySlug } from "@/lib/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/coaching/[slug]/book">): Promise<Metadata> {
  const { slug } = await params;
  const coach = await getPublishedCoachBySlug(slug);
  if (!coach || !coach.booking?.enabled) {
    return { title: "Booking unavailable | eFootball Academy" };
  }
  return {
    title: `Request a Booking — ${coach.name} | eFootball Academy`,
    description: `Request a coaching session with ${coach.name}.`,
  };
}

export default async function BookingPage({
  params,
}: PageProps<"/coaching/[slug]/book">) {
  const { slug } = await params;
  const coach = await getPublishedCoachBySlug(slug);
  if (!coach || !coach.booking?.enabled) notFound();

  return (
    <Section as="div" className="pt-14 pb-16 sm:pt-16 lg:pt-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="text-xs tracking-widest text-muted uppercase">
            Request a Booking
          </p>
          <h1 className="mt-2 font-display text-display-2xl font-bold text-foreground">
            Book a session with {coach.name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-secondary">
            Send a booking request directly to {coach.name}. The coaching
            team will get back to you to confirm the details.
          </p>

          <div className="mt-8 rounded-card border border-border bg-card p-6 sm:p-8">
            <BookingRequestForm coachSlug={coach.slug} />
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              size="sm"
              href={`/coaching/${coach.slug}`}
            >
              Back to coach profile
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
