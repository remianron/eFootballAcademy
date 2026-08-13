import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EditorSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function EditorSection({
  title,
  description,
  children,
  className,
}: EditorSectionProps) {
  return (
    <section className={cn("rounded-card border border-border bg-card p-6", className)}>
      <div className="mb-5">
        <h2 className="text-eyebrow font-display text-muted uppercase">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}