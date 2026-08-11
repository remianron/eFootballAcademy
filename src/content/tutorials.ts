import type { Tutorial } from "@/content/types";

export const tutorials: Tutorial[] = [
  {
    id: "tutorial-fk-curl",
    slug: "free-kicks-edge-of-the-box-curl",
    title: "Edge of the Box: Placing Curled Free Kicks",
    publishedStatus: "published",
    createdAt: "2026-06-18T09:00:00.000Z",
    updatedAt: "2026-07-10T09:00:00.000Z",
    category: "free-kicks",
    description:
      "A repeatable setup for curling free kicks over the wall from 20 to 25 metres.",
    difficulty: "intermediate",
    content:
      "The wall is not the obstacle — your aim point is. Pick a target behind the last man's shoulder rather than the post itself. Most curled free kicks miss because players aim at the goal and let the curve drag the ball wide; aim a full body-width past the wall and let the curl bring it back.\n\nStrike with roughly 55 to 60 percent power and hold the direction across the flight of the ball from the moment of contact. If the ball stays high and floats, your power is too high for the curve you are asking for.\n\nPractice the same spot with the same aim until the trajectory is repeatable. A consistent routine beats a random perfect hit — in matches you will have seconds, not minutes.",
    thumbnail: {
      src: "/media/tutorials/free-kick-curl.jpg",
      alt: "Free kick aim point behind the wall",
    },
    steps: [
      "Set your camera so the wall, both posts and the keeper are visible.",
      "Pick an aim point a body-width past the last man's shoulder.",
      "Hold the direction across the ball and strike at 55–60 percent power.",
      "Watch the flight — if the ball floats, reduce power and add more curve.",
    ],
    tips: [
      "Aim past the wall, not at the post — the curve does the rest.",
      "Rehearse one spot until the trajectory is repeatable.",
      "A runner attacking the near post distracts the keeper from the curl.",
    ],
  },
  {
    id: "tutorial-double-touch",
    slug: "skills-double-touch-in-tight-spaces",
    title: "Double Touch: Creating Space in Tight Corridors",
    publishedStatus: "published",
    createdAt: "2026-07-02T14:00:00.000Z",
    updatedAt: "2026-07-02T14:00:00.000Z",
    category: "skills",
    description:
      "How to use the double touch to escape pressure near the touchline and inside the box.",
    difficulty: "intermediate",
    content:
      "The double touch is a space-maker, not a showboating skill. Use it when a defender closes from your strong side and you have one clean touch to escape. The first push must be short — just enough to make the defender commit — then explode the second touch into the space you just created.\n\nTiming matters more than execution speed. Perform it as the defender is mid-commit, not before they arrive. If the first touch is too long, you hand the ball to them; if it is late, you run into the tackle.\n\nBuild it up in layers: static ball, jogging approach, then a live defender. Once the movement is automatic, start combining it with a directional change the defender cannot read until it is too late.",
    thumbnail: {
      src: "/media/tutorials/double-touch.jpg",
      alt: "Double touch escape pattern",
    },
    steps: [
      "Close in at an angle so the defender commits to your strong side.",
      "Push the ball short with the first touch of the double touch.",
      "Explode into the open space the moment the defender lunges.",
      "Accelerate away — the escape is only as good as your first sprint step.",
    ],
    tips: [
      "Keep the first push short enough to recover if the defender stays.",
      "Perform the move as the defender commits, not before.",
      "Build it up: static ball, jogging approach, then a live defender.",
    ],
  },
  {
    id: "tutorial-slow-dribble",
    slug: "dribbling-close-control-under-pressure",
    title: "Close Control Under Pressure: When to Slow the Game Down",
    publishedStatus: "published",
    createdAt: "2026-06-25T10:00:00.000Z",
    updatedAt: "2026-06-25T10:00:00.000Z",
    category: "dribbling",
    description:
      "Using slow, controlled dribbling to kill tempo, shield the ball and draw defenders out of shape.",
    difficulty: "beginner",
    content:
      "Not every dribble should be at full speed. Slow, close control keeps the ball glued to your feet and changes the rhythm of an attack. It is most valuable when a defender is jockeying you one-on-one: they cannot commit because the ball is never far enough from your body to win.\n\nUse it to kill a fast game, hold possession near the corner flag, or wait for a runner to arrive. The moment the defender steps in, the ball is close enough to push past them.\n\nKeep your body between the ball and the defender, and use the sprint button only when you have decided to go — a burst after a slow approach is far harder to defend than constant speed.",
    thumbnail: {
      src: "/media/tutorials/close-control.jpg",
      alt: "Shielding dribble position",
    },
    steps: [
      "Hold the ball close with the slow-dribble input.",
      "Keep your body between the ball and the defender.",
      "Use it to kill tempo, hold at the corner flag or wait for a runner.",
      "Pick the moment to switch to a burst — change speed, not just direction.",
    ],
    tips: [
      "The slower you approach, the more the defender has to commit.",
      "Slow dribbling near the box draws defenders out of the block.",
      "Release the ball the instant a lane opens.",
    ],
  },
  {
    id: "tutorial-through-balls",
    slug: "passing-weighted-through-balls",
    title: "Weighted Through Balls: Timing the Run",
    publishedStatus: "published",
    createdAt: "2026-07-08T11:00:00.000Z",
    updatedAt: "2026-07-08T11:00:00.000Z",
    category: "passing",
    description:
      "Reading the runner's shoulder line to deliver through balls that arrive at the right moment.",
    difficulty: "intermediate",
    content:
      "A through ball is only as good as its timing. Watch the shoulder line of the runner, not the ball. The pass must arrive as the runner enters the space — too early and the defender intercepts, too late and the runner is offside or the keeper gathers.\n\nThe weight of the pass should match the runner's sprint speed. If the runner is at full pace, the ball needs a longer, harder touch into space; if they are arriving at walking pace, a short ball into feet keeps the attack alive.\n\nAim past the defender, not at the runner. The ball should land in the corridor the runner is attacking, so they meet it at full speed instead of slowing down to collect it.",
    thumbnail: {
      src: "/media/tutorials/through-ball.jpg",
      alt: "Through ball timing diagram",
    },
    steps: [
      "Watch the runner's shoulder line, not the ball.",
      "Time the pass to arrive as the runner enters the space.",
      "Weight the pass to match the runner's sprint speed.",
      "Aim into the corridor ahead of the defender, not at the runner.",
    ],
    tips: [
      "If the runner is at full sprint, the pass needs more depth.",
      "An early ball beats a defender who has already turned to chase.",
      "Vary the height — a lofted release bypasses a pressed passing lane.",
    ],
  },
  {
    id: "tutorial-near-post",
    slug: "shooting-near-post-finishing",
    title: "Near-Post Finishing: Choosing the Right Finish",
    publishedStatus: "draft",
    createdAt: "2026-07-16T09:00:00.000Z",
    updatedAt: "2026-07-16T09:00:00.000Z",
    category: "shooting",
    description:
      "When to strike first-time at the near post and when the finesse shot is the smarter choice.",
    difficulty: "advanced",
    content:
      "Inside the box, the fastest finish is usually the best finish. When the angle is tight and the keeper is closing the near post, a first-time strike past their near shoulder is often quicker than any shot you can set up. The keeper has to cover the far post too, which means the near side opens the instant they shift.\n\nThe finesse shot is the tool for when you have time and a clear angle across the keeper. It trades speed for placement: curl it to the far corner where the keeper is moving away from the ball.\n\nDecide before the ball arrives. A half-second of hesitation turns a good position into a blocked shot. Practice both finishes from the same spot so the decision becomes instinct rather than analysis.",
    thumbnail: {
      src: "/media/tutorials/near-post.jpg",
      alt: "Near-post finishing angle",
    },
    steps: [
      "Decide before the ball arrives — first-time or finesse.",
      "When the angle is tight, strike at the near post before the keeper sets.",
      "When you have time, finesse into the far corner.",
      "Follow the shot — rebounds land in the six-yard box.",
    ],
    tips: [
      "Hesitation turns a good position into a blocked shot.",
      "Practice both finishes from the same spot until the choice is instinct.",
      "The near-post finish punishes keepers who cheat toward the far post.",
    ],
  },
];
