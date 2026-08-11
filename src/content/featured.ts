import type { FeaturedItem } from "@/content/types";

export const featuredContent: FeaturedItem[] = [
  { type: "build", contentId: "build-m-vela-positional-keeper", placement: "hero", order: 1, active: true },
  { type: "tutorial", contentId: "tutorial-fk-curl", placement: "featured", order: 1, active: true },
  { type: "build", contentId: "build-k-ambrose-sole-control", placement: "featured", order: 2, active: true },
  { type: "formation-guide", contentId: "formation-4213-possession", placement: "featured", order: 3, active: true },
  { type: "discovery", contentId: "discovery-first-step-burst", placement: "featured", order: 4, active: true },
  { type: "coach", contentId: "coach-remianron", placement: "featured", order: 5, active: true },
  { type: "discovery", contentId: "discovery-patch-meta", placement: "latest", order: 1, active: true },
  { type: "tutorial", contentId: "tutorial-double-touch", placement: "latest", order: 2, active: true },
  { type: "formation-guide", contentId: "formation-352-wide-counter", placement: "latest", order: 3, active: true },
  { type: "tutorial", contentId: "tutorial-through-balls", placement: "sidebar", order: 1, active: true },
  { type: "build", contentId: "build-m-vela-reaction-keeper", placement: "sidebar", order: 2, active: true },
  { type: "tutorial", contentId: "tutorial-near-post", placement: "latest", order: 9, active: false },
];
