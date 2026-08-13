import type { AttributeDto } from "@/lib/db/types";
import { Button } from "@/components";
import { IconArrowDown, IconArrowUp, IconPlus, IconTrash } from "@/components/icons";
import { cn } from "@/lib/cn";

type KeyAttributesEditorProps = {
  catalog: AttributeDto[];
  values: Record<string, string>;
  selected: string[];
  onChange: (selected: string[]) => void;
  errors: Record<string, string>;
};

export function KeyAttributesEditor({
  catalog,
  values,
  selected,
  onChange,
  errors,
}: KeyAttributesEditorProps) {
  const nameByKey = new Map(catalog.map((attribute) => [attribute.key, attribute.name]));

  const available = catalog.filter(
    (attribute) =>
      values[attribute.key]?.trim() !== "" &&
      !selected.includes(attribute.key)
  );

  const add = (key: string) => onChange([...selected, key]);

  const remove = (index: number) =>
    onChange(selected.filter((_, i) => i !== index));

  const move = (from: number, to: number) => {
    const next = [...selected];
    const [key] = next.splice(from, 1);
    next.splice(Math.min(to, next.length), 0, key);
    onChange(next);
  };

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-secondary">
            Key attributes <span className="ml-2 font-normal text-muted">ordered top to bottom</span>
          </p>
          {selected.length === 0 ? (
            <p className="rounded-control border border-dashed border-border px-3 py-2.5 text-xs text-muted">
              No key attributes selected yet. Key attributes are flagged on
              existing statistics — they never store a duplicate value.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {selected.map((key, index) => {
                const error = errors[`keyAttributes.${index}`];
                const value = values[key] ?? "";
                return (
                  <li
                    key={key}
                    className={cn(
                      "flex items-center gap-2 rounded-control border border-border bg-card-secondary/40 px-3 py-1.5",
                      error && "border-danger/60"
                    )}
                  >
                    <span className="w-5 shrink-0 text-center font-display text-xs font-semibold text-muted tabular-nums">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {nameByKey.get(key) ?? key}
                    </span>
                    <span className="shrink-0 text-xs text-muted tabular-nums">
                      {value}
                    </span>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => move(index, index - 1)}
                        disabled={index === 0}
                        aria-label="Move key attribute up"
                        className="flex h-6 w-6 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                      >
                        <IconArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, index + 1)}
                        disabled={index === selected.length - 1}
                        aria-label="Move key attribute down"
                        className="flex h-6 w-6 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                      >
                        <IconArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        aria-label="Remove key attribute"
                        className="flex h-6 w-6 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-danger"
                      >
                        <IconTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-secondary">
            Available <span className="ml-2 font-normal text-muted">only attributes with a value</span>
          </p>
          {available.length === 0 ? (
            <p className="rounded-control border border-dashed border-border px-3 py-2.5 text-xs text-muted">
              No attributes left. Values entered in the statistics section
              appear here.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {available.map((attribute) => (
                <li
                  key={attribute.key}
                  className="flex items-center gap-2 rounded-control border border-border bg-card-secondary/40 px-3 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-secondary">
                    {attribute.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted tabular-nums">
                    {values[attribute.key] ?? ""}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 shrink-0 gap-1 px-2 text-xs"
                    onClick={() => add(attribute.key)}
                  >
                    <IconPlus className="h-3 w-3" />
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-2">
        {Object.keys(errors)
          .filter((key) => key.startsWith("keyAttributes."))
          .map((key) => (
            <p key={key} className="text-xs text-danger">
              {errors[key]}
            </p>
          ))}
      </div>
    </div>
  );
}