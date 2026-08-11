import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AdminContentCardProps = {
  /** Leading badge / type label. */
  label: ReactNode;
  title: string;
  /** Secondary technical line, e.g. slug or placement. */
  meta?: ReactNode;
  /** Status indicator, e.g. AdminStatusBadge. */
  status?: ReactNode;
  /** Trailing actions row. */
  actions?: ReactNode;
  className?: string;
};

/**
 * Compact list row for admin overviews (dashboard, featured content).
 */
export function AdminContentCard({
  label,
  title,
  meta,
  status,
  actions,
  className,
}: AdminContentCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border/60 px-4 py-3.5 transition-colors duration-150 last:border-b-0 hover:bg-card-secondary/40 sm:flex-row sm:items-center sm:gap-4",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="shrink-0">{label}</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {title}
          </p>
          {meta && (
            <p className="mt-0.5 truncate text-xs text-muted">{meta}</p>
          )}
        </div>
      </div>
      {status && <div className="shrink-0">{status}</div>}
      {actions && (
        <div className="flex shrink-0 items-center gap-1.5">{actions}</div>
      )}
    </div>
  );
}
