import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  /** "full" renders the horizontal logo (crest + wordmark), "compact" the mark only. */
  mode?: "full" | "compact";
  alt?: string;
  className?: string;
};

const ASSETS = {
  full: {
    src: "/brand/logo-horizontal.png",
    width: 400,
    height: 140,
  },
  compact: {
    src: "/brand/logo-mark.png",
    width: 125,
    height: 110,
  },
} as const;

/**
 * Brand logo for eFootball Academy — official brand artwork only.
 *
 * "full"   → /brand/logo-horizontal.png (crest + eFOOTBALL ACADEMY wordmark)
 * "compact" → /brand/logo-mark.png (academy crest mark)
 *
 * The artwork is rendered with `object-contain` and its intrinsic aspect
 * ratio preserved — never stretched or recolored. The full logo scales
 * responsively: ~144px on mobile, ~176px on tablet, 180px on desktop
 * (fits the 64px header; the PNG's baked-in navy background blends with
 * the Midnight Navy UI).
 */
export function BrandLogo({
  mode = "full",
  alt = "eFootball Academy",
  className,
}: BrandLogoProps) {
  const asset = ASSETS[mode];

  return (
    <span className={cn("inline-flex items-center select-none shrink-0", className)}>
      <Image
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        className={cn(
          "object-contain",
          mode === "full"
            ? "h-auto w-36 sm:w-44 lg:w-[180px]"
            : "h-10 w-auto"
        )}
      />
    </span>
  );
}