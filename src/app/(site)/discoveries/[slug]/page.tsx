import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, Card, Container, Section } from "@/components";
import { ContentMediaList } from "@/components/content/content-media";
import { IconFlask } from "@/components/icons";
import {
  DISCOVERY_CATEGORY_LABELS,
  formatDate,
  paragraphs,
  RESEARCH_STATUS_LABELS,
} from "@/lib/labels";
import { getPublishedDiscoveryBySlug } from "@/lib/public";
import type { ResearchStatus } from "@/content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/discoveries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const discovery = await getPublishedDiscoveryBySlug(slug);
  if (!discovery) {
    return { title: "Discovery not found | eFootball Academy" };
  }
  return {
    title: `${discovery.title} | eFootball Academy`,
    description: discovery.excerpt,
  };
}

export default async function DiscoveryPage({
  params,
}: PageProps<"/discoveries/[slug]">) {
  const { slug } = await params;
  const discovery = await getPublishedDiscoveryBySlug(slug);
  if (!discovery) notFound();

  const researchStatus = discovery.researchStatus ?? "example";
  const body = paragraphs(discovery.content);

  return (
    <>
      <Section as="div" className="pt-14 pb-0 sm:pt-16 lg:pt-20">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">
              {DISCOVERY_CATEGORY_LABELS[discovery.category]}
            </Badge>
            <ResearchStatusBadge status={researchStatus} />
          </div>
          <h1 className="mt-4 max-w-3xl text-display-2xl font-display font-bold text-foreground text-balance">
            {discovery.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted text-pretty sm:text-lg">
            {discovery.excerpt}
          </p>
          <p className="mt-4 text-xs text-muted">
            {discovery.author}
            {discovery.publishedAt && (
              <span className="text-muted/70">
                {" · "}
                {formatDate(discovery.publishedAt)}
              </span>
            )}
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <div className="space-y-6">
              <Card padded={false} className="p-5">
                <div className="flex items-center gap-2">
                  <IconFlask className="h-4 w-4 text-electric" />
                  <h2 className="font-display text-display-md font-semibold text-foreground">
                    Research Status
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {researchStatus === "example"
                    ? "This is example research — internal notes and community observations, not a verified study. Treat the findings as hypotheses."
                    : "This finding has been independently reproduced and verified by the Academy."}
                </p>
              </Card>

              {discovery.sources && discovery.sources.length > 0 && (
                <Card padded={false} className="p-5">
                  <h2 className="text-eyebrow text-muted uppercase">
                    Sources
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {discovery.sources.map((source) => (
                      <li
                        key={source}
                        className="flex items-start gap-2 text-sm text-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric"
                        />
                        {source}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            <div className="min-w-0 space-y-5">
              {body.map((paragraphText, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-secondary sm:text-base"
                >
                  {paragraphText}
                </p>
              ))}

              {discovery.media && discovery.media.length > 0 && (
                <div className="pt-2">
                  <ContentMediaList media={discovery.media} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ResearchStatusBadge({ status }: { status: ResearchStatus }) {
  return (
    <Badge variant={status === "field-verified" ? "success" : "purple"}>
      {RESEARCH_STATUS_LABELS[status]}
    </Badge>
  );
}
