"use client";

import { Button } from "@/components";
import {
  IconArrowDown,
  IconArrowUp,
  IconPlus,
  IconTrash,
} from "@/components/icons";
import { MediaEditor } from "@/components/admin/form/media-editor";
import { PairListEditor } from "@/components/admin/form/pair-list-editor";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/form/fields";
import {
  CONTENT_BLOCK_LABELS,
  CONTENT_BLOCK_TYPES,
  type ContentBlockItem,
  type ContentBlockType,
} from "@/lib/content-blocks/types";
import { emptyBlockOfType } from "@/lib/content-blocks/validation";

const MAX_BLOCKS = 50;

type BlockEditorProps = {
  items: ContentBlockItem[];
  onChange: (items: ContentBlockItem[]) => void;
  errors: Record<string, string>;
};

function rekeyErrors(
  errors: Record<string, string>,
  blockIndex: number
): Record<string, string> {
  const prefix = `blocks.${blockIndex}.`;
  const result: Record<string, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(prefix)) {
      result[key.slice(prefix.length)] = message;
    }
  }
  return result;
}

function rekeyMediaErrors(
  errors: Record<string, string>,
  blockIndex: number
): Record<string, string> {
  const prefix = `blocks.${blockIndex}.media.`;
  const result: Record<string, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(prefix)) {
      result[`media.${key.slice(prefix.length)}`] = message;
    }
  }
  return result;
}

function rekeyIndexErrors(
  errors: Record<string, string>,
  blockIndex: number,
  field: string
): Record<number, string> {
  const prefix = `blocks.${blockIndex}.${field}.`;
  const result: Record<number, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(prefix)) {
      const index = Number(key.slice(prefix.length));
      if (Number.isInteger(index)) result[index] = message;
    }
  }
  return result;
}

export function BlockEditor({ items, onChange, errors }: BlockEditorProps) {
  const update = (index: number, patch: Partial<ContentBlockItem>) => {
    onChange(
      items.map((item, i) =>
        i === index ? ({ ...item, ...patch } as ContentBlockItem) : item
      )
    );
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(Math.min(to, next.length), 0, item);
    onChange(next);
  };

  const add = (type: ContentBlockType) => {
    onChange([...items, emptyBlockOfType(type)]);
  };

  const changeType = (index: number, type: ContentBlockType) => {
    const current = items[index];
    const replacement = emptyBlockOfType(type);
    onChange(
      items.map((item, i) =>
        i === index ? { ...replacement, uid: current.uid } : item
      )
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {CONTENT_BLOCK_TYPES.map((type) => (
          <Button
            key={type}
            type="button"
            variant={type === "heading" ? "secondary" : "ghost"}
            size="sm"
            disabled={items.length >= MAX_BLOCKS}
            onClick={() => add(type)}
          >
            <IconPlus className="h-3.5 w-3.5" />
            {CONTENT_BLOCK_LABELS[type]}
          </Button>
        ))}
      </div>

      {items.length === 0 && (
        <p className="rounded-control border border-dashed border-border px-3 py-2.5 text-xs text-muted">
          No content blocks yet. Add headings, paragraphs, media (single or
          side-by-side), custom attributes or custom sections — they render
          in exactly this order on the public page.
        </p>
      )}

      <ul className="space-y-4">
        {items.map((block, index) => {
          const blockErrors = rekeyErrors(errors, index);
          const blockError = errors[`blocks.${index}`];
          return (
            <li
              key={block.uid}
              className="rounded-card border border-border bg-card-secondary/30 p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs font-semibold text-muted tabular-nums">
                    {index + 1}
                  </span>
                  <span className="rounded-pill border border-border bg-card px-2 py-0.5 text-[0.6875rem] font-medium text-secondary">
                    {CONTENT_BLOCK_LABELS[block.type]}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Move block up"
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <IconArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === items.length - 1}
                    aria-label="Move block down"
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <IconArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="Remove block"
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-danger"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Type"
                  value={block.type}
                  onChange={(event) =>
                    changeType(index, event.target.value as ContentBlockType)
                  }
                  options={CONTENT_BLOCK_TYPES.map((type) => ({
                    value: type,
                    label: CONTENT_BLOCK_LABELS[type],
                  }))}
                  className="sm:max-w-xs"
                />
                {block.type === "heading" && (
                  <SelectField
                    label="Heading level"
                    value={block.level}
                    onChange={(event) =>
                      update(index, {
                        level: event.target.value as "2" | "3",
                      })
                    }
                    error={blockErrors.level}
                    options={[
                      { value: "2", label: "Section heading (H2)" },
                      { value: "3", label: "Sub-heading (H3)" },
                    ]}
                  />
                )}
              </div>

              {block.type === "heading" && (
                <TextField
                  label="Heading text"
                  required
                  value={block.text}
                  maxLength={200}
                  onChange={(event) => update(index, { text: event.target.value })}
                  error={blockErrors.text}
                />
              )}

              {block.type === "text" && (
                <TextAreaField
                  label="Paragraph text"
                  required
                  rows={6}
                  value={block.content}
                  onChange={(event) =>
                    update(index, { content: event.target.value })
                  }
                  hint="Blank lines create separate paragraphs."
                  error={blockErrors.content}
                />
              )}

              {block.type === "media" && (
                <div>
                  <MediaEditor
                    items={block.media}
                    onChange={(media) => update(index, { media })}
                    errors={rekeyMediaErrors(errors, index)}
                    emptyHint="Add one media item, or two or more to show them side-by-side."
                  />
                </div>
              )}

              {block.type === "attributes" && (
                <PairListEditor
                  label="Attribute list"
                  values={block.items}
                  onChange={(items) => update(index, { items })}
                  firstLabel="Attribute name"
                  secondLabel="Value"
                  firstPlaceholder="e.g. Balance"
                  secondPlaceholder="e.g. Excellent"
                  maxItems={12}
                  errors={rekeyIndexErrors(errors, index, "items")}
                />
              )}

              {block.type === "custom" && (
                <div className="grid gap-4">
                  <TextField
                    label="Section label (optional)"
                    value={block.label}
                    maxLength={80}
                    onChange={(event) =>
                      update(index, { label: event.target.value })
                    }
                    hint="Shown as a heading above the content, e.g. Notes, Tactical Explanation."
                    error={blockErrors.label}
                  />
                  <TextAreaField
                    label="Content"
                    required
                    rows={6}
                    value={block.content}
                    onChange={(event) =>
                      update(index, { content: event.target.value })
                    }
                    hint="Blank lines create separate paragraphs."
                    error={blockErrors.content}
                  />
                </div>
              )}

              {blockError && (
                <p className="mt-3 text-xs leading-relaxed text-danger">
                  {blockError}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}