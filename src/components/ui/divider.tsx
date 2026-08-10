import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type DividerProps = {
  /** Optional technical label rendered in the middle of the line. */
  label?: ReactNode;
  className?: string;
};

/**
 * Subtle horizontal separator.
 */
export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn("h-px border-0 bg-border", className)} />;
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      <span className="text-eyebrow font-display text-muted uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}
