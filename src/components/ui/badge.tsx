import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant =
  | "primary"
  | "electric"
  | "gold"
  | "neutral"
  | "outline"
  | "success"
  | "warning"
  | "danger"
  | "purple";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "className">;

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary/15 text-electric border-primary/40",
  electric: "bg-electric/10 text-electric border-electric/40",
  gold: "bg-gold/10 text-gold border-gold/40",
  neutral: "bg-card-secondary text-secondary border-border",
  outline: "bg-transparent text-muted border-border",
  success: "bg-success/10 text-success border-success/40",
  warning: "bg-warning/10 text-warning border-warning/40",
  danger: "bg-danger/10 text-danger border-danger/40",
  purple: "bg-purple/10 text-purple border-purple/40",
};

/**
 * Compact technical label for statuses, categories and meta data.
 */
export function Badge({
  children,
  variant = "neutral",
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5",
        "text-[0.6875rem] font-medium tracking-wide whitespace-nowrap uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
