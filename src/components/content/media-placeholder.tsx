import type { ReactNode } from "react";
import { IconGrid } from "@/components/icons";
import { cn } from "@/lib/cn";

type MediaPlaceholderProps = {
  label: string;
  icon?: ReactNode;
  className?: string;
};

export function MediaPlaceholder({
  label,
  icon,
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`${label} — media placeholder`}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-control border border-dashed border-border bg-card-secondary/60 p-6 text-center",
        className
      )}
    >
      {icon ?? <IconGrid className="h-6 w-6 text-muted" />}
      <span className="text-[0.6875rem] leading-relaxed tracking-widest text-muted uppercase">
        {label}
      </span>
    </div>
  );
}
