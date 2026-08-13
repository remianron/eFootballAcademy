import type { StatCategory } from "@/generated/prisma/client";
import type { AttributeDto } from "@/lib/db/types";
import { STAT_MAX, STAT_MIN } from "@/lib/build-editor/validation";
import { cn } from "@/lib/cn";

const CATEGORY_LABELS: Record<StatCategory, string> = {
  OFFENSIVE: "Offensive",
  DEFENSIVE: "Defensive",
  PHYSICAL: "Physical",
  GOALKEEPER: "Goalkeeper",
};

const CATEGORY_ORDER: StatCategory[] = [
  "OFFENSIVE",
  "DEFENSIVE",
  "PHYSICAL",
  "GOALKEEPER",
];

const CATEGORY_DESCRIPTIONS: Record<StatCategory, string> = {
  OFFENSIVE: "Attack, finishing, passing and dribbling.",
  DEFENSIVE: "Defending, awareness and interception.",
  PHYSICAL: "Speed, stamina and physical contact.",
  GOALKEEPER: "Goalkeeper-specific attributes.",
};

type StatisticsEditorProps = {
  catalog: AttributeDto[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  errors: Record<string, string>;
};

export function StatisticsEditor({
  catalog,
  values,
  onChange,
  errors,
}: StatisticsEditorProps) {
  const update = (key: string, value: string) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="space-y-6">
      {CATEGORY_ORDER.map((category) => {
        const attributes = catalog.filter(
          (attribute) => attribute.category === category
        );
        if (attributes.length === 0) return null;
        return (
          <div key={category}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h3 className="font-display text-display-md font-semibold text-foreground">
                {CATEGORY_LABELS[category]}
              </h3>
              <span className="text-xs text-right text-muted">
                {CATEGORY_DESCRIPTIONS[category]}
              </span>
            </div>
            <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {attributes.map((attribute) => {
                const value = values[attribute.key] ?? "";
                const error = errors[`statistics.${attribute.key}`];
                return (
                  <div key={attribute.key} className="flex items-center gap-3 py-1">
                    <label
                      htmlFor={`stat-${attribute.key}`}
                      className="min-w-0 flex-1 truncate text-sm text-secondary"
                    >
                      {attribute.name}
                    </label>
                    <div className="flex min-w-0 items-center gap-2">
                      <input
                        id={`stat-${attribute.key}`}
                        type="number"
                        inputMode="numeric"
                        min={STAT_MIN}
                        max={STAT_MAX}
                        value={value}
                        onChange={(event) =>
                          update(attribute.key, event.target.value)
                        }
                        aria-invalid={error ? true : undefined}
                        placeholder="—"
                        className={cn(
                          "w-20 shrink-0 rounded-control border border-border bg-card-secondary/60 px-2 py-1.5 text-right text-sm text-foreground tabular-nums placeholder:text-muted focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30",
                          error && "border-danger/60 focus:border-danger"
                        )}
                      />
                      {error && (
                        <span className="min-w-0 max-w-[12rem] text-xs leading-snug text-danger">
                          {error}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}