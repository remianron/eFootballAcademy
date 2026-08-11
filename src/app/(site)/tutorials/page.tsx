import type { Metadata } from "next";
import { Container, PageHeader, Section } from "@/components";
import { TutorialCard } from "@/components/content/tutorial-card";
import { TUTORIAL_CATEGORY_LABELS, TUTORIAL_CATEGORY_ORDER } from "@/lib/labels";
import { getTutorials } from "@/lib/content";
import type { TutorialCategory } from "@/content/types";

export const metadata: Metadata = {
  title: "Tutorials | eFootball Academy",
  description:
    "eFootball Academy tutorials — free kicks, skills, dribbling, passing and shooting, taught by experienced coaches.",
};

export default async function TutorialsPage() {
  const tutorials = await getTutorials();

  const grouped = TUTORIAL_CATEGORY_ORDER.map((category) => ({
    category,
    items: tutorials.filter(
      (tutorial) => tutorial.category === category
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <PageHeader
            eyebrow="Tutorials"
            title="Learn how better players think."
            description="Technique breakdowns, decision frameworks and practice routines — written by eFootball Academy coaches."
          />
        </Container>
      </Section>

      {grouped.map((group) => (
        <Section key={group.category} className={group.category !== grouped[0].category ? "pt-0" : ""}>
          <Container>
            <h2 className="font-display text-display-lg font-semibold text-foreground">
              {TUTORIAL_CATEGORY_LABELS[group.category as TutorialCategory]}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className={
                    group.items.length === 1
                      ? "sm:col-span-2 lg:col-span-3"
                      : undefined
                  }
                >
                  <TutorialCard tutorial={tutorial} />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ))}
    </>
  );
}
