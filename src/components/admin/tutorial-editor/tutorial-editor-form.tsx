"use client";

import { useState } from "react";
import type { PublishStatus } from "@/generated/prisma/client";
import { slugify } from "@/lib/build-editor/slug";
import { emptyTutorialFormState } from "@/lib/tutorial-editor/transform";
import type {
  TutorialEditorFormState,
  TutorialEditorInput,
  TutorialEditorStatus,
} from "@/lib/tutorial-editor/types";
import {
  archiveTutorialAction,
  createTutorialAction,
  deleteTutorialAction,
  restoreTutorialAction,
  updateTutorialAction,
} from "@/app/admin/tutorials/actions";
import {
  EditorFooter,
  EditorHeader,
  EditorSection,
  errorsForKey,
  useEditorAction,
} from "@/components/admin/content-editor";
import {
  MediaEditor,
  SelectField,
  StringListEditor,
  TextAreaField,
  TextField,
} from "@/components/admin/form";
import {
  DIFFICULTY_OPTIONS,
  TUTORIAL_CATEGORY_OPTIONS,
} from "@/lib/content-editor/labels";

type TutorialEditorFormProps = {
  tutorialId?: string;
  initial?: TutorialEditorFormState;
  status?: PublishStatus;
};

type SaveAction = (
  input: TutorialEditorInput
) => Promise<
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; error?: string }
>;

function toInput(
  form: TutorialEditorFormState,
  status: TutorialEditorStatus
): TutorialEditorInput {
  return {
    title: form.title,
    slug: form.slug,
    category: form.category as TutorialEditorInput["category"],
    difficulty: form.difficulty as TutorialEditorInput["difficulty"],
    description: form.description,
    content: form.content,
    steps: form.steps,
    tips: form.tips,
    media: form.media.map((item) => ({
      kind: item.kind,
      youtubeInput: item.youtubeInput,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      alt: item.alt,
      caption: item.caption,
      aspectRatio: item.aspectRatio,
    })),
    status,
  };
}

export function TutorialEditorForm({
  tutorialId,
  initial,
  status,
}: TutorialEditorFormProps) {
  const [form, setForm] = useState<TutorialEditorFormState>(
    initial ?? emptyTutorialFormState()
  );
  const { pending, errors, actionError, runAction } = useEditorAction();

  const set = (patch: Partial<TutorialEditorFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleTitle = (value: string) =>
    setForm((current) => ({
      ...current,
      title: value,
      slug: current.slugTouched ? current.slug : slugify(value),
    }));

  const save = (status: TutorialEditorStatus) => {
    const action: SaveAction = tutorialId
      ? (input) => updateTutorialAction(tutorialId!, input)
      : createTutorialAction;
    runAction(() => action(toInput(form, status)));
  };

  const archive = () =>
    tutorialId &&
    runAction(() => archiveTutorialAction(tutorialId));

  const restore = () =>
    tutorialId &&
    runAction(() => restoreTutorialAction(tutorialId));

  const remove = () => {
    if (!tutorialId) return;
    if (!window.confirm("Delete this draft permanently? This cannot be undone.")) {
      return;
    }
    runAction(() => deleteTutorialAction(tutorialId!));
  };

  const fieldError = (key: string) => errors[key];

  return (
    <div>
      <EditorHeader
        status={status}
        viewHref={form.slug ? `/tutorials/${form.slug}` : null}
        pending={pending}
        onArchive={archive}
        onRestore={restore}
        onDelete={remove}
      />

      {actionError && (
        <div className="mb-6 rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      )}

      <div className="space-y-6">
        <EditorSection
          title="Identity"
          description="The public URL and categorization of the tutorial."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Title"
              required
              value={form.title}
              onChange={(event) => handleTitle(event.target.value)}
              error={fieldError("title")}
            />
            <TextField
              label="Slug"
              required
              value={form.slug}
              onChange={(event) => {
                set({ slug: slugify(event.target.value), slugTouched: true });
              }}
              hint="Public URL: /tutorials/… — suggested from the title."
              error={fieldError("slug")}
            />
            <SelectField
              label="Category"
              required
              value={form.category}
              onChange={(event) =>
                set({ category: event.target.value as TutorialEditorFormState["category"] })
              }
              error={fieldError("category")}
              options={[
                { value: "", label: "Choose category" },
                ...TUTORIAL_CATEGORY_OPTIONS,
              ]}
            />
            <SelectField
              label="Difficulty"
              required
              value={form.difficulty}
              onChange={(event) =>
                set({ difficulty: event.target.value as TutorialEditorFormState["difficulty"] })
              }
              error={fieldError("difficulty")}
              options={[
                { value: "", label: "Choose difficulty" },
                ...DIFFICULTY_OPTIONS,
              ]}
            />
          </div>
        </EditorSection>

        <EditorSection
          title="Overview & content"
          description="The description shows in tutorial lists; the content is the body. Separate paragraphs with a blank line."
        >
          <div className="grid gap-4">
            <TextAreaField
              label="Description"
              required={status === "PUBLISHED"}
              rows={3}
              value={form.description}
              onChange={(event) => set({ description: event.target.value })}
              error={fieldError("description")}
            />
            <TextAreaField
              label="Content"
              required={status === "PUBLISHED"}
              rows={14}
              value={form.content}
              onChange={(event) => set({ content: event.target.value })}
              error={fieldError("content")}
            />
          </div>
        </EditorSection>

        <div className="grid gap-6 md:grid-cols-2">
          <EditorSection title="Steps">
            <StringListEditor
              label="Step list"
              values={form.steps}
              onChange={(steps) => set({ steps })}
              placeholder="e.g. Hold L1 and flick the right stick…"
              maxItems={20}
              maxItemLength={500}
              errors={errorsForKey("steps", errors)}
            />
          </EditorSection>
          <EditorSection title="Tips">
            <StringListEditor
              label="Tip list"
              values={form.tips}
              onChange={(tips) => set({ tips })}
              placeholder="e.g. Release earlier in tight spaces"
              maxItems={12}
              maxItemLength={300}
              errors={errorsForKey("tips", errors)}
            />
          </EditorSection>
        </div>

        <EditorSection
          title="Media"
          description="Videos and images for the tutorial page, in display order."
        >
          <MediaEditor
            items={form.media}
            onChange={(media) => set({ media })}
            errors={errors}
            emptyHint="No media yet. The first video is featured at the top of the tutorial."
          />
        </EditorSection>
      </div>

      <EditorFooter
        listHref="/admin/tutorials"
        pending={pending}
        onSaveDraft={() => save("DRAFT")}
        onPublish={() => save("PUBLISHED")}
      />
    </div>
  );
}