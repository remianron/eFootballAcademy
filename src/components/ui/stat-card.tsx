import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StatCardProps = {
  /** Label shown above the value. */
  label: string;
  /** Numeric or technical value, rendered in display type. */
  value: ReactNode;
  /** Optional trend / delta line, e.g. "+12.4%". */
  delta?: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  className?: string;
};

/**
 * Data display card for statistics and metrics. Values should only
 * come from real data sources.
 */
export function StatCard({ label, value, delta, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-card p-5 shadow-card",
        "transition-all duration-250 hover:border-primary/50 hover:shadow-card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          {label}
        </p>
        {icon && <span className="shrink-0 text-electric">{icon}</span>}
      </div>
      <p className="mt-3 text-stat font-display font-bold text-foreground tabular-nums">
        {value}
      </p>
      {delta && (
        <p className="mt-2 text-xs font-medium text-secondary">{delta}</p>
      )}
    </div>
  );
}
