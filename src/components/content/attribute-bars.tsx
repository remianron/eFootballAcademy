import { cn } from "@/lib/cn";

type StatBarProps = {
  label: string;
  value: number;
  max?: number;
  className?: string;
};

export function StatBar({ label, value, max = 101, className }: StatBarProps) {
  const width = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-secondary">{label}</span>
        <span className="font-display text-xs font-semibold text-electric tabular-nums">
          {value}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border/60"
      >
        <div
          className="h-full rounded-full bg-electric"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

type StatBarsProps = {
  attributes: Record<string, number>;
  max?: number;
  className?: string;
};

export function StatBars({ attributes, max = 101, className }: StatBarsProps) {
  return (
    <div className={cn("grid gap-x-6 gap-y-4 sm:grid-cols-2", className)}>
      {Object.entries(attributes).map(([label, value]) => (
        <StatBar key={label} label={label} value={value} max={max} />
      ))}
    </div>
  );
}

type OvrRingProps = {
  value: number;
  label?: string;
  className?: string;
};

export function OvrRing({ value, label = "OVR", className }: OvrRingProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, value / 99);
  return (
    <div className={cn("relative h-20 w-20 shrink-0", className)}>
      <svg viewBox="0 0 96 96" className="h-20 w-20 -rotate-90" aria-hidden="true">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="6"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--color-electric)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${circumference * progress} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-bold text-foreground tabular-nums">
          {value}
        </span>
        <span className="text-[0.625rem] font-medium tracking-[0.2em] text-gold uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
