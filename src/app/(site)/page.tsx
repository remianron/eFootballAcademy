import { Hero } from "@/components/home/hero";
import { Pillars } from "@/components/home/pillars";
import { BuildSpotlight } from "@/components/home/build-spotlight";
import { LearningSection } from "@/components/home/learning-section";
import { DiscoveriesSection } from "@/components/home/discoveries-section";
import { CoachesSection } from "@/components/home/coaches-section";
import { FinalCta } from "@/components/home/final-cta";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <BuildSpotlight />
      <LearningSection />
      <DiscoveriesSection />
      <CoachesSection />
      <FinalCta />
    </>
  );
}
