"use client";

import { useEffect } from "react";
import { Button, Card } from "@/components";
import { isDataSourceUnavailableError } from "@/lib/db/errors";

/**
 * Admin error boundary. A missing or unreachable database renders an
 * explicit unavailable state with configuration guidance; every other
 * error keeps the generic state so real bugs are not masked.
 */
export default function AdminErrorPage({
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
    <div className="mt-8">
      <Card className="mx-auto max-w-xl p-8 text-center sm:p-12">
        <p className="text-eyebrow font-display text-muted uppercase">
          Admin
        </p>
        <h1 className="mt-3 font-display text-display-lg font-semibold text-foreground">
          {unavailable ? "Database unavailable" : "Something went wrong"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {unavailable
            ? "The content database is not reachable. Check the DATABASE_URL value and confirm the MySQL/MariaDB server is running, then try again."
            : "An unexpected error occurred while loading this page. Please try again."}
        </p>
        <Button className="mt-7" onClick={retry}>
          Try again
        </Button>
      </Card>
    </div>
  );
}