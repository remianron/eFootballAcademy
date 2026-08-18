import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = {
  /** Accessible name for the action. */
  label: string;
  children: ReactNode;
  variant?: "subtle" | "outline";
  size?: "sm" | "md";
  className?: string;
  ref?: Ref<HTMLButtonElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "aria-label">;

const variants = {
  subtle: "bg-transparent text-muted hover:bg-card-secondary hover:text-foreground",
  outline:
    "border border-border bg-transparent text-secondary hover:border-electric hover:text-electric",
} as const;

const sizes = {
  sm: "h-9 w-9 rounded-control",
  md: "h-11 w-11 rounded-control",
} as const;

/**
 * Square icon-only action button. Requires an accessible label.
 */
export function IconButton({
  label,
  children,
  variant = "subtle",
  size = "md",
  className,
  ref,
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center",
        "transition-all duration-150 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}
