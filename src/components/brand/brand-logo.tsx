import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  /** "full" renders the mark with the wordmark, "compact" renders the mark only. */
  mode?: "full" | "compact";
  /** "dark" for the dark-first site, "light" for inverted surfaces. */
  theme?: "dark" | "light";
  /** Production logo asset. When provided it replaces the placeholder mark. */
  logo?: string;
  alt?: string;
  className?: string;
};

/**
 * Brand logo for eFootball Academy.
 *
 * Until the final production asset is supplied, a geometric placeholder
 * mark is rendered. Pass `logo` (path to an image) to swap in the real
 * asset — no other changes required.
 */
export function BrandLogo({
  mode = "full",
  theme = "dark",
  logo,
  alt = "eFootball Academy",
  className,
}: BrandLogoProps) {
  const dark = theme === "dark";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 select-none",
        className
      )}
    >
      {logo ? (
        <Image
          src={logo}
          alt={alt}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 object-contain"
        />
      ) : (
        <BrandMark dark={dark} />
      )}
      {mode === "full" && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-sm font-bold tracking-[0.08em] uppercase",
              dark ? "text-foreground" : "text-background"
            )}
          >
            eFootball
          </span>
          <span
            className={cn(
              "mt-1 text-[0.625rem] font-medium tracking-[0.42em] uppercase",
              dark ? "text-electric" : "text-primary"
            )}
          >
            Academy
          </span>
        </span>
      )}
    </span>
  );
}

function BrandMark({ dark }: { dark: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      className="h-10 w-10 shrink-0"
    >
      <rect width="48" height="48" rx="12" fill="#0066ff" />
      <rect
        width="48"
        height="48"
        rx="12"
        fill="none"
        stroke="#00d4ff"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <circle
        cx="24"
        cy="24"
        r="13"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="13"
        ry="5.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.25"
        strokeOpacity="0.65"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="5.5"
        ry="13"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.25"
        strokeOpacity="0.65"
      />
      <circle
        cx="24"
        cy="24"
        r="3.75"
        fill={dark ? "#00d4ff" : "#020a1a"}
      />
      <rect
        x="36.5"
        y="5.5"
        width="6"
        height="6"
        rx="1.5"
        fill="#ffc107"
      />
    </svg>
  );
}
