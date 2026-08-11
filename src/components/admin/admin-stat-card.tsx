import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type AdminStatCardProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  /** When provided the card links to the matching admin section. */
  href?: string;
  className?: string;
};

/**
 * Compact metric card for the admin dashboard. Values should only come
 * from the content access layers.
 */
export function AdminStatCard({
  label,
  value,
  hint,
  icon,
  href,
  className,
}: AdminStatCardProps) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.6875rem] font-semibold tracking-widest text-muted uppercase">
          {label}
        </p>
        {icon && <span className="shrink-0 text-electric">{icon}</span>}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-foreground tabular-nums">
        {value}
      </p>
      {hint && (
        <p className="mt-2 text-xs font-medium text-secondary">{hint}</p>
      )}
    </>
  );

  const classes = cn(
    "block rounded-card border border-border bg-card p-4 shadow-card",
    "transition-colors duration-150",
    href && "hover:border-primary/50 hover:shadow-card-hover",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return <div className={classes}>{inner}</div>;
}
