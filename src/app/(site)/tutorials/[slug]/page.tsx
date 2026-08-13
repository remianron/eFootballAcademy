import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Container, Divider, Section } from "@/components";
import { IconLightbulb } from "@/components/icons";
import { MediaPlaceholder } from "@/components/content/media-placeholder";
import {
  DIFFICULTY_LABELS,
  formatDate,
  paragraphs,
  TUTORIAL_CATEGORY_LABELS,
} from "@/lib/labels";
import { getPublishedTutorialBySlug } from "@/lib/public";
import type { Difficulty } from "@/content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/tutorials/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await getPublishedTutorialBySlug(slug);
  if (!tutorial) {
    return { title: "Tutorial not found | eFootball Academy" };
  }
  return {
    title: `${tutorial.title} | eFootball Academy`,
    description: tutorial.description,
  };
}

const difficultyVariants: Record<Difficulty, "success" | "warning" | "gold"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "gold",
};

export default async function TutorialPage({
  params,
}: PageProps<"/tutorials/[slug]">) {
  const { slug } = await params;
  const tutorial = await getPublishedTutorialBySlug(slug);
  if (!tutorial) notFound();

  const body = paragraphs(tutorial.content);

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="electric">
              {TUTORIAL_CATEGORY_LABELS[tutorial.category]}
            </Badge>
            <Badge variant={difficultyVariants[tutorial.difficulty]}>
              {DIFFICULTY_LABELS[tutorial.difficulty]}
            </Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-display-2xl font-display font-bold text-foreground text-balance">
            {tutorial.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted text-pretty sm:text-lg">
            {tutorial.description}
          </p>
          <p className="mt-4 text-xs text-muted">
            Updated {formatDate(tutorial.updatedAt)}
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)] lg:gap-12">
            <MediaPlaceholder
              label={`${tutorial.category} tutorial media`}
              className="aspect-[16/10] w-full min-w-0 lg:sticky lg:top-24"
            />

            <div className="min-w-0">
              <div className="space-y-5">
                {body.map((paragraphText, index) => (
                  <p
                    key={index}
                    className="text-sm leading-relaxed text-secondary sm:text-base"
                  >
                    {paragraphText}
                  </p>
                ))}
              </div>

              {tutorial.steps && tutorial.steps.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-display-lg font-semibold text-foreground">
                    The Steps
                  </h2>
                  <ol className="mt-5 space-y-4">
                    {tutorial.steps.map((step, index) => (
                      <li
                        key={step}
                        className="flex items-start gap-4 text-sm leading-relaxed text-secondary"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control border border-electric/40 bg-electric/10 font-display text-xs font-bold text-electric tabular-nums">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {tutorial.tips && tutorial.tips.length > 0 && (
                <div className="mt-10">
                  <Divider className="mb-8" />
                  <div className="flex items-center gap-2">
                    <IconLightbulb className="h-4 w-4 text-gold" />
                    <h2 className="font-display text-display-lg font-semibold text-foreground">
                      Key Tips
                    </h2>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {tutorial.tips.map((tip) => (
                      <li
                        key={tip}
                        className="flex items-start gap-3 text-sm leading-relaxed text-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                        />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
