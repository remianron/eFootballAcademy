import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  /** Technical label rendered above the title in display type. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Heading block used to open content sections. The heading element
 * is always an h2 — pages should reserve h1 for PageHeader.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "max-w-2xl",
        centered && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-eyebrow font-display text-electric uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-display-2xl font-display font-bold text-foreground text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted text-pretty sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
