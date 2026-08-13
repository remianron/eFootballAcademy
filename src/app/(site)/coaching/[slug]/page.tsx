import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components";
import { IconExternalLink, IconUsers } from "@/components/icons";
import { initials } from "@/lib/labels";
import { getPublishedCoachBySlug } from "@/lib/public";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/coaching/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const coach = await getPublishedCoachBySlug(slug);
  if (!coach) {
    return { title: "Coach not found | eFootball Academy" };
  }
  return {
    title: `${coach.name} — Expert Coach | eFootball Academy`,
    description: coach.bio,
  };
}

export default async function CoachPage({
  params,
}: PageProps<"/coaching/[slug]">) {
  const { slug } = await params;
  const coach = await getPublishedCoachBySlug(slug);
  if (!coach) notFound();

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <div className="flex flex-wrap items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-xl font-bold text-electric"
            >
              {initials(coach.name)}
            </span>
            <div>
              <h1 className="font-display text-display-2xl font-bold text-foreground">
                {coach.name}
              </h1>
              <p className="mt-1 text-xs tracking-widest text-muted uppercase">
                Expert Coach
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
            <div>
              <h2 className="font-display text-display-md font-semibold text-foreground">
                Specialties
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {coach.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-pill border border-electric/40 bg-electric/10 px-2.5 py-1 text-[0.6875rem] font-medium text-electric"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="font-display text-display-md font-semibold text-foreground">
                  Follow
                </h2>
                <ul className="mt-4 space-y-3">
                  {coach.socialLinks.map((link) => (
                    <li key={link.platform}>
                      <a
                        href={link.url}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-electric"
                      >
                        {link.platform}
                        <IconExternalLink className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-electric" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-card border border-border bg-card p-5">
                <p className="flex items-center gap-2 text-xs text-muted">
                  <IconUsers className="h-4 w-4 text-electric" />
                  Booking and sessions arrive in a future phase.
                </p>
              </div>
            </div>

            <div className="min-w-0 space-y-10">
              <div>
                <h2 className="text-eyebrow text-muted uppercase">Biography</h2>
                <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
                  {coach.bio}
                </p>
              </div>

              <div>
                <h2 className="text-eyebrow text-muted uppercase">
                  Coaching Philosophy
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
                  {coach.coachingDescription}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
