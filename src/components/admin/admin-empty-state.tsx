import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AdminEmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/**
 * Standalone empty state used by admin list sections when a collection
 * has no content yet.
 */
export function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-card px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-control border border-border bg-card-secondary text-muted">
          {icon}
        </span>
      )}
      <h2 className="font-display text-display-md font-semibold text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
