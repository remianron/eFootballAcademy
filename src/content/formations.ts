import type { FormationGuide } from "@/content/types";

export const formations: FormationGuide[] = [
  {
    id: "formation-4213-possession",
    slug: "4213-possession-game",
    title: "4-2-1-3 Possession Game",
    publishedStatus: "published",
    createdAt: "2026-06-20T09:00:00.000Z",
    updatedAt: "2026-07-12T09:00:00.000Z",
    formation: "4-2-1-3",
    playstyle: "Possession",
    description:
      "A patient build-up shape that creates overloads in the half-spaces and isolates wingers in 1v1 situations. The double pivot protects the transition and gives the advanced playmaker freedom between the lines.",
    diagram: {
      src: "/media/formations/4213-possession.png",
      alt: "4-2-1-3 possession formation diagram",
    },
    playerRoles: [
      {
        position: "GK",
        description:
          "First distribution option. Comfortable receiving short passes under pressure.",
      },
      {
        position: "RB / LB",
        description:
          "Stay wide to stretch the block and provide the wide passing lane in build-up.",
      },
      {
        position: "CM (D)",
        description:
          "Screen the back line and dictate the first pass out of pressure.",
      },
      {
        position: "AMF",
        description:
          "The connector in the half-space. Receives between the lines and links wingers.",
      },
      {
        position: "LWF / RWF",
        description:
          "Isolated against the full-back with licence to attack the byline.",
      },
      {
        position: "CF",
        description:
          "The reference point for hold-up play and the target for cutbacks.",
      },
    ],
    tacticalInstructions: [
      "Build through the half-spaces, not through the middle of the block",
      "Double pivot drops between the centre-backs to create a 3-2 base",
      "Full-backs hold width until the ball is progressed past the first line",
      "Wingers stay high and wide to stretch the opponent's back four",
      "On losing the ball, the AMF presses the first pass while the pivot screens",
    ],
    strengths: [
      "Natural overloads in the half-spaces",
      "Strong protection against counter attacks with the double pivot",
      "Wingers get regular 1v1 isolation",
    ],
    weaknesses: [
      "Dependent on the AMF being found in tight spaces",
      "Vulnerable to aggressive man-marking on the double pivot",
      "Full-backs exposed if the pivot is bypassed",
    ],
    recommendedUsage:
      "Use when you expect to dominate possession against mid-blocks and need controlled progression against organised defences. It struggles against very compact low blocks without elite wing play.",
  },
  {
    id: "formation-352-wide-counter",
    slug: "352-wide-counter-attack",
    title: "3-5-2 Wide Counter",
    publishedStatus: "published",
    createdAt: "2026-07-03T09:00:00.000Z",
    updatedAt: "2026-07-03T09:00:00.000Z",
    formation: "3-5-2",
    playstyle: "Quick Counter",
    description:
      "A wing-back driven shape that overloads wide areas in transition and drops into a compact five-at-the-back block without the ball. The strike pair gives an immediate vertical threat.",
    diagram: {
      src: "/media/formations/352-wide-counter.png",
      alt: "3-5-2 wide counter formation diagram",
    },
    playerRoles: [
      {
        position: "GK",
        description:
          "Sweeper keeper role — starts counters with long distribution to the wing-backs.",
      },
      {
        position: "CB (C)",
        description:
          "The spare defender who steps out to engage the ball carrier in transitions.",
      },
      {
        position: "CB (L/R)",
        description:
          "Tight cover defenders for the space behind the wing-backs.",
      },
      {
        position: "WB (L/R)",
        description:
          "The engines of the system. Provide width in attack and recover to form the back five.",
      },
      {
        position: "CM",
        description:
          "One ball-winner who screens, one box-to-box runner who joins attacks late.",
      },
      {
        position: "CF (D)",
        description:
          "Drops off the front line to receive the first pass and release the runner.",
      },
      {
        position: "CF",
        description:
          "The vertical runner — attacks the space behind the defensive line on every turnover.",
      },
    ],
    tacticalInstructions: [
      "Wing-backs are the first option on every turnover",
      "The dropping striker is the release valve against the press",
      "Centre-backs split wide so the pivot can receive centrally",
      "Compact block shifts as one unit, never chasing the ball",
      "Second balls in midfield are the trigger for the quick counter",
    ],
    strengths: [
      "Five players behind the ball without the ball",
      "Wing-back overloads create constant width",
      "Two-striker threat punishes defensive mistakes quickly",
    ],
    weaknesses: [
      "Huge space behind the wing-backs on switches of play",
      "Centre-backs exposed in wide channels against pacy wingers",
      "Dependent on wing-back stamina for 90 minutes",
    ],
    recommendedUsage:
      "Best for teams that want to defend in a mid-low block and explode into vertical transitions. Avoid against opponents who attack with inverted wingers and overlapping full-backs.",
  },
  {
    id: "formation-442-low-block",
    slug: "442-low-block-defense",
    title: "4-4-2 Low Block",
    publishedStatus: "published",
    createdAt: "2026-07-11T09:00:00.000Z",
    updatedAt: "2026-07-11T09:00:00.000Z",
    formation: "4-4-2",
    playstyle: "Long Ball Counter",
    description:
      "A compact two-line block designed to protect the box, win second balls and strike through a target man. The classic underdog shape that makes the game narrow and physical.",
    diagram: {
      src: "/media/formations/442-low-block.png",
      alt: "4-4-2 low block formation diagram",
    },
    playerRoles: [
      {
        position: "GK",
        description:
          "Stays on the line. Commands the six-yard box on crosses.",
      },
      {
        position: "LB / RB",
        description:
          "Stay back in all phases. Form the first line of the block and never overlap.",
      },
      {
        position: "CB",
        description:
          "Defend the box, attack the ball on crosses and win the first ball in duels.",
      },
      {
        position: "LM / RM",
        description:
          "Track the opponent's full-backs and tuck in to protect the half-spaces.",
      },
      {
        position: "CM",
        description:
          "One ball-winner screens the back four, the other covers the second balls.",
      },
      {
        position: "CF (T)",
        description:
          "The target man — receives long balls and holds the ball until support arrives.",
      },
      {
        position: "CF",
        description:
          "The poacher — occupies the space around the target man and finishes half-chances.",
      },
    ],
    tacticalInstructions: [
      "Block sits between 25 and 35 metres from the goal",
      "The midfield line slides to protect the space in front of the box",
      "Never press beyond the halfway line",
      "Long balls to the target man are the first option on every regain",
      "Second ball winners trigger the counter, not the target man",
    ],
    strengths: [
      "Extremely hard to break down centrally",
      "Physical dominance in aerial duels",
      "Simple, repeatable patterns suit organised teams",
    ],
    weaknesses: [
      "Concedes control of the wings",
      "No natural width in possession",
      "Requires high concentration — one shape break usually concedes",
    ],
    recommendedUsage:
      "Use against technically superior opponents when a draw is a good result. The block punishes impatience — the longer the opponent holds the ball, the more space opens behind their own line.",
  },
];
