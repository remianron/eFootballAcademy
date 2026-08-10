import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  as?: ElementType;
  id?: string;
  className?: string;
};

/**
 * Vertical rhythm block. All major page sections use this for
 * consistent responsive spacing.
 */
export function Section({ children, as, id, className }: SectionProps) {
  const Tag = as ?? "section";
  return (
    <Tag
      id={id}
      className={cn("py-16 sm:py-20 lg:py-24", className)}
    >
      {children}
    </Tag>
  );
}
