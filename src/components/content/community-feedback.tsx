import { Badge, Card } from "@/components";
import { formatDate } from "@/lib/labels";
import type { CommunityFeedback } from "@/content/types";

export function CommunityFeedbackList({
  feedback,
}: {
  feedback: CommunityFeedback[];
}) {
  if (feedback.length === 0) {
    return (
      <Card className="border-dashed bg-card-secondary/40">
        <p className="text-sm leading-relaxed text-muted">
          No community feedback yet for this build. Feedback will be added here
          as the Academy curates it.
        </p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {feedback.map((item, index) => (
        <li key={index}>
          <Card padded={false} className="p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Badge variant="neutral">{item.platform}</Badge>
              <span className="font-display text-xs font-semibold text-secondary">
                {item.author}
              </span>
              {item.verified && <Badge variant="success">Verified</Badge>}
              {item.date && (
                <span className="text-xs text-muted/70">
                  {formatDate(item.date)}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              “{item.comment}”
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
