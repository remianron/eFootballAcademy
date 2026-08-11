import type { Discovery } from "@/content/types";

export const discoveries: Discovery[] = [
  {
    id: "discovery-first-step-burst",
    slug: "first-step-burst-acceleration-test",
    title: "First-Step Burst: Does Acceleration Decide the Race?",
    publishedStatus: "published",
    createdAt: "2026-07-18T09:00:00.000Z",
    updatedAt: "2026-07-18T09:00:00.000Z",
    category: "experiments",
    excerpt:
      "A small lab test comparing acceleration and speed splits over the first ten metres. Example data from Academy field notes.",
    content:
      "Setup: controlled sprints with different acceleration/speed allocations, measured over the first three steps and at ten metres. Dataset is small and internally generated — example research only, not a verified study.\n\nOur example results suggest acceleration dominates the first three steps, while top speed takes over once the player is fully extended around ten metres. In practice, that means burst-heavy builds win the first movement off the mark, but speed builds close the gap the longer the run continues.\n\nOpen question: how much does the defender's starting posture change the first-step contest? That is next on the list.",
    author: "Academy Research Lab",
    sources: [
      "Academy lab test log 07 (example dataset)",
      "Community sprint logs v2 (example)",
    ],
    publishedAt: "2026-07-18T09:00:00.000Z",
    researchStatus: "example",
    thumbnail: {
      src: "/media/discoveries/first-step-burst.jpg",
      alt: "First-step burst test setup",
    },
  },
  {
    id: "discovery-dribble-momentum",
    slug: "dribbling-momentum-direction-changes",
    title: "Dribbling Momentum: What Changes When You Hold the Direction",
    publishedStatus: "published",
    createdAt: "2026-07-09T14:30:00.000Z",
    updatedAt: "2026-07-09T14:30:00.000Z",
    category: "mechanics",
    excerpt:
      "How holding a direction during a touch changes the ball's release angle compared with tapping it. Example observations.",
    content:
      "There is a visible difference between tapping a direction for a touch and holding it through the contact. Holding the direction seems to lock the ball onto a longer release line, while tapping keeps the ball closer and allows a second quick adjustment.\n\nFrom field testing, the held direction is better for committing a defender and accelerating away, while the tap is better for tight corridor dribbling where the ball must stay within reach.\n\nThese are example observations from our own tests — the values change with player balance and dribbling stats, and we are still mapping the thresholds.",
    author: "RemianRon",
    publishedAt: "2026-07-09T14:30:00.000Z",
    researchStatus: "example",
    thumbnail: {
      src: "/media/discoveries/dribble-momentum.jpg",
      alt: "Dribbling release angle comparison",
    },
  },
  {
    id: "discovery-finishing-thresholds",
    slug: "finishing-thresholds-inside-box",
    title: "Finishing Thresholds: What Actually Decides Inside-Box Chances",
    publishedStatus: "published",
    createdAt: "2026-06-28T10:15:00.000Z",
    updatedAt: "2026-06-28T10:15:00.000Z",
    category: "efootball-science",
    excerpt:
      "An example attribute sweep across finishing, awareness and kicking power on inside-box shots.",
    content:
      "We swept finishing, offensive awareness and kicking power independently on inside-box shots and logged conversion rates. Dataset is example data from internal tests — treat the findings as hypotheses, not conclusions.\n\nThe clearest pattern: awareness seems to create the chances (arriving at the right spot), while finishing converts them. Kicking power mattered mostly on shots taken under pressure, where a rushed finish needs enough power to beat the keeper before they set.\n\nNext step is a controlled test of finishing in motion — shooting while sprinting versus shooting from a standstill.",
    author: "Academy Science Desk",
    sources: ["Academy attribute sweep 03 (example)"],
    publishedAt: "2026-06-28T10:15:00.000Z",
    researchStatus: "example",
    thumbnail: {
      src: "/media/discoveries/finishing-thresholds.jpg",
      alt: "Finishing attribute sweep chart",
    },
  },
  {
    id: "discovery-patch-meta",
    slug: "update-meta-defensive-playstyles",
    title: "Meta Watch: The Latest Update Shifted Defensive Playstyles",
    publishedStatus: "published",
    createdAt: "2026-07-02T08:00:00.000Z",
    updatedAt: "2026-07-02T08:00:00.000Z",
    category: "updates",
    excerpt:
      "Community reports and our own tests suggest defensive playstyles behave differently after the patch. Example analysis.",
    content:
      "After the latest update, community reports point to a shift in how defensive playstyles track runs — specifically, a slightly delayed reaction to second runs behind the defensive line.\n\nOur example tests on the updated build could not reproduce every report, but the direction is consistent: organised low blocks felt more stable, while aggressive high defensive lines conceded more space in behind.\n\nThis is example analysis based on community reports and a small internal sample. We will revisit once more data settles.",
    author: "Academy Editorial",
    sources: ["Community patch reports thread (example)"],
    publishedAt: "2026-07-02T08:00:00.000Z",
    researchStatus: "example",
    thumbnail: {
      src: "/media/discoveries/patch-meta.jpg",
      alt: "Defensive playstyle comparison after update",
    },
  },
];
