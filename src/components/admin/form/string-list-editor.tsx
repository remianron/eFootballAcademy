import { Button } from "@/components";
import { IconArrowDown, IconArrowUp, IconPlus, IconTrash } from "@/components/icons";
import { inputClass } from "@/components/admin/form/fields";
import { cn } from "@/lib/cn";

export type StringListErrors = Record<number, string>;

type StringListEditorProps = {
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  maxItemLength?: number;
  errors?: StringListErrors;
  className?: string;
};

export function StringListEditor({
  label,
  hint,
  values,
  onChange,
  placeholder,
  maxItems = 10,
  maxItemLength,
  errors,
  className,
}: StringListEditorProps) {
  const canAdd = values.length < maxItems;

  const updateItem = (index: number, value: string) => {
    onChange(values.map((item, i) => (i === index ? value : item)));
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const moveItem = (from: number, to: number) => {
    const next = [...values];
    const [item] = next.splice(from, 1);
    next.splice(Math.min(to, next.length), 0, item);
    onChange(next);
  };

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-secondary">
          {label}
          <span className="ml-2 font-normal text-muted">
            {values.length}/{maxItems}
          </span>
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canAdd}
          onClick={() => onChange([...values, ""])}
        >
          <IconPlus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>
      {hint && <p className="mb-3 text-xs leading-relaxed text-muted">{hint}</p>}
      {values.length === 0 ? (
        <p className="rounded-control border border-dashed border-border px-3 py-2.5 text-xs text-muted">
          Nothing here yet. Add the first item.
        </p>
      ) : (
        <ul className="space-y-2">
          {values.map((value, index) => {
            const item = value;
            const error = errors?.[index];
            return (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-2.5 w-5 shrink-0 text-center font-display text-xs font-semibold text-muted tabular-nums">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={item}
                    maxLength={maxItemLength}
                    placeholder={placeholder}
                    onChange={(event) => updateItem(index, event.target.value)}
                    aria-invalid={error ? true : undefined}
                    className={cn(
                      inputClass,
                      error && "border-danger/60 focus:border-danger"
                    )}
                  />
                  {error && (
                    <p className="mt-1 text-xs leading-relaxed text-danger">
                      {error}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1 pt-1.5">
                  <button
                    type="button"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move ${label} item up`}
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <IconArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === values.length - 1}
                    aria-label={`Move ${label} item down`}
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <IconArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label={`Remove ${label} item`}
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card-secondary hover:text-danger"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}