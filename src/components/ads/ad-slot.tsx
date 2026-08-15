import { cn } from "@/lib/cn";
import {
  AD_ADSENSE_CLIENT,
  AD_DEBUG,
  AD_FORMAT_ASPECT,
  AD_MONETAG_SCRIPT_URL,
  AD_PROVIDER,
  AD_SLOT_CONFIG,
  isAdEnabled,
  type AdPlacement,
} from "@/lib/ads/config";
import { AdSenseUnit, MonetagUnit } from "@/components/ads/provider-ad";

/**
 * Reusable ad slot.
 *
 * Behavior:
 *   - Advertising disabled (AD_PROVIDER=none): renders nothing in
 *     production; shows a subtle placeholder frame in development so
 *     slots can be verified visually. No third-party script is ever
 *     loaded in this state.
 *   - Advertising enabled: renders the provider-specific unit inside a
 *     reserved-size container (no layout jump) with a small
 *     "Advertisement" label. AD_DEBUG=true forces the placeholder frame
 *     instead of the real unit for local testing.
 *
 * Slots must be placed BETWEEN logical content sections — never inside a
 * single CMS content block.
 */
export function AdSlot({
  placement,
  className,
}: {
  placement: AdPlacement;
  className?: string;
}) {
  const config = AD_SLOT_CONFIG[placement];
  const enabled = isAdEnabled();
  const inProduction = process.env.NODE_ENV === "production";

  if (!enabled && inProduction && !AD_DEBUG) return null;

  const label = (
    <p className="mb-1.5 text-center text-[0.625rem] font-medium tracking-[0.2em] text-muted/50 uppercase">
      Advertisement
    </p>
  );

  if (AD_DEBUG || !enabled) {
    return (
      <div className={cn("w-full", className)} aria-hidden="true">
        {label}
        <div
          className={cn(
            "flex w-full items-center justify-center rounded-card border border-dashed border-border bg-card-secondary/40",
            config.minHeight
          )}
        >
          <span className="text-[0.6875rem] text-muted/60">
            Ad slot — {placement}
          </span>
        </div>
      </div>
    );
  }

  const unit = (() => {
    if (AD_PROVIDER === "adsense") {
      return (
        <AdSenseUnit
          client={AD_ADSENSE_CLIENT}
          className="h-full w-full"
        />
      );
    }
    if (AD_PROVIDER === "monetag") {
      return <MonetagUnit scriptUrl={AD_MONETAG_SCRIPT_URL} className="h-full w-full" />;
    }
    return null;
  })();

  return (
    <div className={cn("w-full", className)}>
      {label}
      <div className="mx-auto w-full overflow-hidden rounded-card border border-border/40 bg-card-secondary/30">
        <div className={cn("relative w-full", AD_FORMAT_ASPECT[config.format], config.minHeight)}>
          {unit}
        </div>
      </div>
    </div>
  );
}