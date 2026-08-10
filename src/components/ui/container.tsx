import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  /** Width tier, mapped to the container design tokens. */
  size?: "page" | "wide" | "narrow" | "full";
  className?: string;
  style?: CSSProperties;
};

const sizes: Record<NonNullable<ContainerProps["size"]>, string> = {
  page: "max-w-page",
  wide: "max-w-wide",
  narrow: "max-w-narrow",
  full: "max-w-none",
};

/**
 * Centered layout container. Handles responsive horizontal padding.
 */
export function Container({
  children,
  size = "page",
  className,
  style,
}: ContainerProps) {
  return (
    <div
      style={style}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
}
