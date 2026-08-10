import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  /** Surface tone. */
  tone?: "default" | "secondary" | "elevated";
  /** Subtle border lift on hover. */
  hover?: boolean;
  padded?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className">;

const tones = {
  default: "bg-card border-border",
  secondary: "bg-card-secondary border-border",
  elevated: "bg-card border-primary/40 shadow-elevated",
} as const;

/**
 * Base surface for panels, lists and content blocks.
 */
export function Card({
  children,
  tone = "default",
  hover = false,
  padded = true,
  className,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-card border shadow-card",
        "transition-all duration-250",
        tones[tone],
        hover &&
          "hover:border-primary/50 hover:shadow-card-hover hover:-translate-y-0.5",
        padded && "p-5 sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
