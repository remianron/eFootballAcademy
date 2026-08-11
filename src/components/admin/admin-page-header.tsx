import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

/**
 * Compact functional page header for admin sections. Renders the single
 * h1 of the route plus optional trailing actions.
 */
export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-eyebrow font-display text-electric uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-display-lg font-display font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
