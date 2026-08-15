"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { cn } from "@/lib/cn";

/**
 * Provider-specific ad units.
 *
 * Each provider is isolated in its own component and receives everything it
 * needs via props from the (server) AdSlot — these components never read
 * process.env directly. When a provider is disabled the unit renders
 * nothing and no script is loaded.
 */

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseUnit({
  client,
  className,
}: {
  client: string;
  className?: string;
}) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* Ad blocked or unavailable — never throw on the page. */
    }
  }, []);

  return (
    <>
      {/* next/script dedupes by id, so multiple units share one loader. */}
      <Script
        id="adsense-loader"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      <ins
        className={cn("adsbygoogle block", className)}
        data-ad-client={client}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}

export function MonetagUnit({
  scriptUrl,
  className,
}: {
  scriptUrl: string;
  className?: string;
}) {
  if (!scriptUrl) return null;

  return (
    <div className={cn("relative", className)} data-monetag-slot="true">
      <Script id="monetag-loader" strategy="afterInteractive" src={scriptUrl} />
    </div>
  );
}