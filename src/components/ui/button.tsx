import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-card hover:bg-electric hover:text-background",
  secondary:
    "bg-card-secondary text-foreground border border-border hover:border-primary hover:text-electric",
  outline:
    "border border-border text-secondary hover:border-electric hover:text-electric",
  ghost: "text-secondary hover:bg-card-secondary hover:text-foreground",
  danger: "bg-danger text-white hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-sm",
};

/**
 * Action control. Renders an anchor when `href` is provided,
 * otherwise a native button.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } =
    props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-control font-medium tracking-wide whitespace-nowrap",
    "transition-all duration-150 cursor-pointer",
    "focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (props.href !== undefined) {
    const { href, ...anchorRest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
