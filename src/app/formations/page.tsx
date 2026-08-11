import type { Metadata } from "next";
import { Container, PageHeader, Section } from "@/components";
import { FormationCard } from "@/components/content/formation-card";
import { getFormationGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Formations | eFootball Academy",
  description:
    "Formation guides with playstyles, player roles, tactical instructions and strengths and weaknesses — from eFootball Academy coaches.",
};

export default async function FormationsPage() {
  const formations = await getFormationGuides();

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <PageHeader
            eyebrow="Formations"
            title="Tactical guides for real match problems."
            description="Each guide covers the shape, the playstyle it fits, player roles and the tactical trade-offs you need to know."
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
