"use client";

import { useEffect } from "react";
import { Button, Container, Section } from "@/components";
import { isDataSourceUnavailableError } from "@/lib/db/errors";

/**
 * Public site error boundary. When the database cannot be reached the
 * page shows an explicit unavailable state — no fallback content is
 * ever served. Any other error keeps the generic state so real bugs are
 * not masked.
 */
export default function SiteErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const unavailable = isDataSourceUnavailableError(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="flex-1">
      <Container>
        <div className="mx-auto mt-6 max-w-xl rounded-card border border-border bg-card p-8 text-center sm:p-12">
          <p className="text-eyebrow font-display text-electric uppercase">
            eFootball Academy
          </p>
          <h1 className="mt-3 font-display text-display-lg font-semibold text-foreground">
            {unavailable
              ? "Content temporarily unavailable"
              : "Something went wrong"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {unavailable
              ? "The content database is not reachable right now. No content is being served until the connection is restored. Please try again in a moment."
              : "An unexpected error occurred while loading this page. Please try again."}
          </p>
          <Button className="mt-7" onClick={retry}>
            Try again
          </Button>
        </div>
      </Container>
    </Section>
  );
}