import Link from "next/link";
import { Badge, Card } from "@/components";
import { IconArrowRight } from "@/components/icons";
import {
  DIFFICULTY_LABELS,
  TUTORIAL_CATEGORY_LABELS,
} from "@/lib/labels";
import type { Difficulty, Tutorial } from "@/content/types";

const difficultyVariants: Record<Difficulty, "success" | "warning" | "gold"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "gold",
};

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-electric focus-visible:outline-offset-2"
    >
      <Card hover className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="electric">
            {TUTORIAL_CATEGORY_LABELS[tutorial.category]}
          </Badge>
          <Badge variant={difficultyVariants[tutorial.difficulty]}>
            {DIFFICULTY_LABELS[tutorial.difficulty]}
          </Badge>
        </div>
        <h3 className="mt-4 font-display text-display-md font-semibold text-foreground">
          {tutorial.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
          {tutorial.description}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium text-secondary transition-colors group-hover:text-electric">
          Read tutorial
          <IconArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </Link>
  );
}
