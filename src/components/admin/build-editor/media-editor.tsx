import type { MediaFormItem } from "@/lib/build-editor/types";
import { ASPECT_RATIOS } from "@/lib/build-editor/validation";
import { Button } from "@/components";
import {
  IconArrowDown,
  IconArrowUp,
  IconImage,
  IconPlus,
  IconTrash,
} from "@/components/icons";
import { SelectField, TextField } from "@/components/admin/form";

const KIND_LABELS: Record<MediaFormItem["kind"], string> = {
  YOUTUBE_VIDEO: "YouTube video",
  IMAGE: "Image",
  GIF: "GIF",
};

function localUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type MediaEditorProps = {
  items: MediaFormItem[];
  onChange: (items: MediaFormItem[]) => void;
  errors: Record<string, string>;
};

export function MediaEditor({ items, onChange, errors }: MediaEditorProps) {
  const update = (index: number, patch: Partial<MediaFormItem>) => {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item))
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

  const add = (kind: MediaFormItem["kind"]) => {
    onChange([
      ...items,
      {
        uid: localUid(),
        kind,
        youtubeInput: "",
        url: "",
        thumbnailUrl: "",
        alt: "",
        caption: "",
        aspectRatio: "16:9",
      },
    ]);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => add("YOUTUBE_VIDEO")}>
          <IconPlus className="h-3.5 w-3.5" />
          Add YouTube video
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => add("IMAGE")}>
          <IconImage className="h-3.5 w-3.5" />
          Add image
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => add("GIF")}>
          <IconPlus className="h-3.5 w-3.5" />
          Add GIF
        </Button>
      </div>

      {items.length === 0 && (
        <p className="rounded-control border border-dashed border-border px-3 py-2.5 text-xs text-muted">
          No additional media yet. YouTube videos, images and GIFs are
          supported — the progression screenshot has its own field above.
        </p>
      )}

      <ul className="space-y-4">
        {items.map((item, index) => {
          const itemError = (field: string) => errors[`media.${index}.${field}`];
          const baseError = errors.media;
          return (
            <li
              key={item.uid}
              className="rounded-card border border-border bg-card-secondary/30 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-xs font-semibold text-muted tabular-nums">
                    {index + 1}
                  </span>
                  <span className="rounded-pill border border-border bg-card px-2 py-0.5 text-[0.6875rem] font-medium text-secondary">
                    {KIND_LABELS[item.kind]}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Move media item up"
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <IconArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === items.length - 1}
                    aria-label="Move media item down"
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <IconArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="Remove media item"
                    className="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-card hover:text-danger"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {baseError && index === 0 && (
                <p className="mb-3 text-xs text-danger">{baseError}</p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Type"
                  value={item.kind}
                  onChange={(event) =>
                    update(index, { kind: event.target.value as MediaFormItem["kind"] })
                  }
                  options={(Object.keys(KIND_LABELS) as MediaFormItem["kind"][]).map(
                    (kind) => ({ value: kind, label: KIND_LABELS[kind] })
                  )}
                />
                <SelectField
                  label="Aspect ratio"
                  value={item.aspectRatio}
                  onChange={(event) =>
                    update(index, { aspectRatio: event.target.value })
                  }
                  error={itemError("aspectRatio")}
                  options={ASPECT_RATIOS.map((ratio) => ({
                    value: ratio,
                    label: ratio,
                  }))}
                />
                {item.kind === "YOUTUBE_VIDEO" ? (
                  <TextField
                    label="YouTube URL or video ID"
                    required
                    value={item.youtubeInput}
                    onChange={(event) =>
                      update(index, { youtubeInput: event.target.value })
                    }
                    placeholder="https://youtube.com/watch?v=… or 11-char ID"
                    error={itemError("youtube")}
                    className="sm:col-span-2"
                  />
                ) : (
                  <TextField
                    label={item.kind === "GIF" ? "GIF URL" : "Image URL"}
                    required
                    value={item.url}
                    onChange={(event) => update(index, { url: event.target.value })}
                    placeholder="https://…"
                    error={itemError("url")}
                    className="sm:col-span-2"
                  />
                )}
                <TextField
                  label="Thumbnail URL (optional)"
                  value={item.thumbnailUrl}
                  onChange={(event) =>
                    update(index, { thumbnailUrl: event.target.value })
                  }
                  placeholder="https://…"
                  error={itemError("thumbnail")}
                  className="sm:col-span-2"
                />
                <TextField
                  label="Alt text"
                  value={item.alt}
                  maxLength={200}
                  onChange={(event) => update(index, { alt: event.target.value })}
                  error={itemError("alt")}
                />
                <TextField
                  label="Caption"
                  value={item.caption}
                  maxLength={300}
                  onChange={(event) =>
                    update(index, { caption: event.target.value })
                  }
                  error={itemError("caption")}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}