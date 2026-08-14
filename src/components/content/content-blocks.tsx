import { cn } from "@/lib/cn";
import { paragraphs } from "@/lib/labels";
import type { ContentBlock } from "@/content/types";
import { ContentMediaRow } from "@/components/content/content-media";

/**
 * Shared editorial content-block renderer (flexible CMS). Blocks render
 * in exactly the stored order. Used by builds, tutorials, formations,
 * discoveries and coaches detail pages. Returns null when empty so
 * pages without blocks render exactly as before.
 */
export function ContentBlockList({
  blocks,
  className,
}: {
  blocks: ContentBlock[] | undefined;
  className?: string;
}) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className={cn("space-y-8", className)}>
      {blocks.map((block, index) => (
        <ContentBlockItem key={index} block={block} />
      ))}
    </div>
  );
}

function ContentBlockItem({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <h3 className="font-display text-display-md font-semibold text-foreground">
          {block.text}
        </h3>
      ) : (
        <h2 className="font-display text-display-lg font-semibold text-foreground">
          {block.text}
        </h2>
      );
    case "text":
      return (
        <div className="space-y-4">
          {paragraphs(block.content).map((paragraphText, index) => (
            <p
              key={index}
              className="text-sm leading-relaxed text-secondary sm:text-base"
            >
              {paragraphText}
            </p>
          ))}
        </div>
      );
    case "media":
      return <ContentMediaRow media={block.media} />;
    case "attributes":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item, index) => (
            <div
              key={index}
              className="rounded-card border border-border bg-card-secondary/40 p-4"
            >
              <p className="text-eyebrow font-display text-muted uppercase">
                {item.name}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      );
    case "custom":
      return (
        <div>
          {block.label && (
            <h3 className="font-display text-display-md font-semibold text-foreground">
              {block.label}
            </h3>
          )}
          <div className={cn("space-y-4", block.label && "mt-3")}>
            {paragraphs(block.content).map((paragraphText, index) => (
              <p
                key={index}
                className="text-sm leading-relaxed text-secondary sm:text-base"
              >
                {paragraphText}
              </p>
            ))}
          </div>
        </div>
      );
  }
}