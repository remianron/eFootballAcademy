import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  /** Technical label above the h1. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional trailing actions, e.g. buttons. */
  actions?: ReactNode;
  className?: string;
};

/**
 * Page-level header. Renders the single h1 for the route and
 * optional actions.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-eyebrow font-display text-electric uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-display-3xl font-display font-bold text-foreground text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted text-pretty sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
