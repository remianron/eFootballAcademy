import { SiteHeader } from "@/components/home/site-header";
import { Hero } from "@/components/home/hero";
import { Pillars } from "@/components/home/pillars";
import { PlayerIntelligence } from "@/components/home/player-intelligence";
import { Coaching } from "@/components/home/coaching";
import { Science } from "@/components/home/science";
import { Builds } from "@/components/home/builds";
import { Discoveries } from "@/components/home/discoveries";
import { Coaches } from "@/components/home/coaches";
import { FinalCta } from "@/components/home/final-cta";
import { SiteFooter } from "@/components/home/site-footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-control focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="flex-1">
        <Hero />
        <Pillars />
        <PlayerIntelligence />
        <Coaching />
        <Science />
        <Builds />
        <Discoveries />
        <Coaches />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
