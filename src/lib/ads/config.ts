/**
 * Centralized advertising configuration.
 *
 * The site ships with advertising DISABLED by default (AD_PROVIDER=none).
 * When disabled, no third-party script is ever loaded and AdSlot renders
 * nothing in production (a subtle placeholder is shown in development only
 * so slots can be verified visually).
 *
 * Supported providers:
 *   - none     (default) — fully inert
 *   - adsense  — Google AdSense (standard auto-rendered ins unit)
 *   - monetag  — Monetag (script hosted by the provider, URL supplied via env)
 *
 * Real publisher / ad-unit identifiers are NEVER hard-coded; they come from
 * the environment and are injected by the operator. Every identifier below
 * is a placeholder that renders nothing.
 */

export const AD_PROVIDER = process.env.AD_PROVIDER ?? "none";

export type AdProvider = "none" | "adsense" | "monetag";

export type AdPlacement =
  /** Leaderboard right under the hero, above the fold. */
  | "hero-bottom"
  /** Leaderboard at the top of listing pages. */
  | "top-banner"
  /** Medium rectangle between logical content sections. */
  | "content-inline"
  /** Vertical rectangle in desktop sidebars. */
  | "sidebar"
  /** Leaderboard before the related/CTA content at the end of a page. */
  | "before-related"
  /** Leaderboard just above the footer. */
  | "before-footer";

export type AdFormat = "leaderboard" | "rectangle" | "vertical";

type AdSlotConfig = {
  format: AdFormat;
  /** Minimum reserved height so pages do not jump when an ad loads. */
  minHeight: string;
};

export const AD_SLOT_CONFIG: Record<AdPlacement, AdSlotConfig> = {
  "hero-bottom": { format: "leaderboard", minHeight: "h-[100px] sm:h-[110px]" },
  "top-banner": { format: "leaderboard", minHeight: "h-[100px] sm:h-[110px]" },
  "content-inline": { format: "rectangle", minHeight: "h-[280px]" },
  sidebar: { format: "vertical", minHeight: "h-[250px] sm:h-[600px]" },
  "before-related": { format: "leaderboard", minHeight: "h-[100px] sm:h-[110px]" },
  "before-footer": { format: "leaderboard", minHeight: "h-[100px] sm:h-[110px]" },
};

export const AD_FORMAT_ASPECT: Record<AdFormat, string> = {
  leaderboard: "aspect-[728/90]",
  rectangle: "aspect-[336/280]",
  vertical: "aspect-[300/600]",
};

/** Google AdSense publisher ID, e.g. "ca-pub-0000000000000000". */
export const AD_ADSENSE_CLIENT =
  process.env.AD_ADSENSE_CLIENT ?? "ca-pub-0000000000000000";

/** Monetag site key / script URL — supplied by the operator. */
export const AD_MONETAG_SCRIPT_URL = process.env.AD_MONETAG_SCRIPT_URL ?? "";

/** Show the development placeholder frame even when a provider is active. */
export const AD_DEBUG = process.env.AD_DEBUG === "true";

export function isAdEnabled(): boolean {
  return AD_PROVIDER === "adsense" || AD_PROVIDER === "monetag";
}