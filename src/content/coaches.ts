import type { Coach } from "@/content/types";

export const coaches: Coach[] = [
  {
    id: "coach-remianron",
    slug: "remianron",
    name: "RemianRon",
    profileImage: {
      src: "/media/coaches/remianron.jpg",
      alt: "RemianRon profile picture",
    },
    bio: "RemianRon has spent years studying the mechanics behind high-level eFootball play — from set-piece placement to the micro-movements that decide 1v1 situations. He focuses on explaining why things work, not just how to do them.",
    specialties: [
      "Advanced Mechanics",
      "Free Kicks",
      "Dribbling",
      "Player Builds",
    ],
    socialLinks: [
      { platform: "YouTube", url: "#" },
      { platform: "Discord", url: "#" },
    ],
    coachingDescription:
      "One-on-one sessions covering mechanics review, repeatable free kick routines and build planning. Sessions are built around your current squad and the specific problems you face in matches.",
    status: "active",
    booking: { enabled: false },
  },
  {
    id: "coach-julian-cross",
    slug: "julian-cross",
    name: "Julian Cross",
    profileImage: {
      src: "/media/coaches/julian-cross.jpg",
      alt: "Julian Cross profile picture",
    },
    bio: "Julian Cross specialises in build-up play and possession structures. His coaching is centred on decision-making: where to look, when to pass and how to keep the ball moving under pressure.",
    specialties: [
      "Passing",
      "Build-Up Play",
      "Vision",
      "Possession",
    ],
    socialLinks: [
      { platform: "YouTube", url: "#" },
      { platform: "X", url: "#" },
    ],
    coachingDescription:
      "Focused coaching on passing selection, positional patterns and breaking presses. Each session reviews match footage and builds repeatable solutions for your specific setup.",
    status: "active",
    booking: { enabled: false },
  },
  {
    id: "coach-elena-ortiz",
    slug: "elena-ortiz",
    name: "Elena Ortiz",
    profileImage: {
      src: "/media/coaches/elena-ortiz.jpg",
      alt: "Elena Ortiz profile picture",
    },
    bio: "Elena Ortiz coaches the final third. Her work is about efficiency: better positions, earlier decisions and finishing techniques that work under match pressure.",
    specialties: [
      "Finishing",
      "Positioning",
      "Shooting Technique",
      "Off-Ball Movement",
    ],
    socialLinks: [
      { platform: "YouTube", url: "#" },
      { platform: "Instagram", url: "#" },
    ],
    coachingDescription:
      "Sessions on movement off the ball, finishing selection and converting the chances your system creates. Ideal for players who feel they should be scoring more.",
    status: "active",
    booking: { enabled: false },
  },
];
