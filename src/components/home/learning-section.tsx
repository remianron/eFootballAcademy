import { Button, Container, Section, SectionHeading } from "@/components";
import { TutorialCard } from "@/components/content/tutorial-card";
import { FormationCard } from "@/components/content/formation-card";
import { getFeaturedContent } from "@/lib/public";

export async function LearningSection() {
  const featured = await getFeaturedContent("featured");
  const tutorials = featured
    .filter((entry) => entry.type === "tutorial")
    .map((entry) => entry.content);
  const formations = featured
    .filter((entry) => entry.type === "formation-guide")
    .map((entry) => entry.content);

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Learning"
            title="From free kicks to formations."
            description="Coaching modules, technique breakdowns and tactical guides — selected by the Academy."
          />
          <div className="flex flex-wrap gap-3">
            <Button href="/tutorials" variant="outline" size="sm">
              All Tutorials
            </Button>
            <Button href="/formations" variant="outline" size="sm">
              All Formations
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:mt-12">
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
          {formations.map((formation) => (
            <FormationCard key={formation.id} formation={formation} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
