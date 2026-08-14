"use client";

import { useState } from "react";
import type { PublishStatus } from "@/generated/prisma/client";
import { slugify } from "@/lib/build-editor/slug";
import { emptyFormationFormState } from "@/lib/formation-editor/transform";
import type {
  FormationEditorFormState,
  FormationEditorInput,
} from "@/lib/formation-editor/types";
import {
  archiveFormationAction,
  createFormationAction,
  deleteFormationAction,
  restoreFormationAction,
  updateFormationAction,
} from "@/app/admin/formations/actions";
import {
  EditorFooter,
  EditorHeader,
  EditorSection,
  errorsForKey,
  useEditorAction,
} from "@/components/admin/content-editor";
import {
  BlockEditor,
  MediaEditor,
  PairListEditor,
  StringListEditor,
  TextAreaField,
  TextField,
} from "@/components/admin/form";

type FormationEditorFormProps = {
  formationGuideId?: string;
  initial?: FormationEditorFormState;
  status?: PublishStatus;
};

function toInput(
  form: FormationEditorFormState,
  status: "DRAFT" | "PUBLISHED"
): FormationEditorInput {
  return {
    title: form.title,
    slug: form.slug,
    formation: form.formation,
    playstyle: form.playstyle,
    description: form.description,
    recommendedUsage: form.recommendedUsage,
    tacticalInstructions: form.tacticalInstructions,
    strengths: form.strengths,
    weaknesses: form.weaknesses,
    roles: form.roles.map((role) => ({
      position: role.first,
      description: role.second,
    })),
    media: form.media.map((item) => ({
      kind: item.kind,
      youtubeInput: item.youtubeInput,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      alt: item.alt,
      caption: item.caption,
      aspectRatio: item.aspectRatio,
    })),
    blocks: form.blocks,
    status,
  };
}

export function FormationEditorForm({
  formationGuideId,
  initial,
  status,
}: FormationEditorFormProps) {
  const [form, setForm] = useState<FormationEditorFormState>(
    initial ?? emptyFormationFormState()
  );
  const { pending, errors, actionError, runAction } = useEditorAction();

  const set = (patch: Partial<FormationEditorFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleTitle = (value: string) =>
    setForm((current) => ({
      ...current,
      title: value,
      slug: current.slugTouched ? current.slug : slugify(value),
    }));

  const save = (target: "DRAFT" | "PUBLISHED") => {
    const input = toInput(form, target);
    const action = formationGuideId
      ? () => updateFormationAction(formationGuideId, input)
      : () => createFormationAction(input);
    runAction(action);
  };

  const archive = () =>
    formationGuideId && runAction(() => archiveFormationAction(formationGuideId));
  const restore = () =>
    formationGuideId && runAction(() => restoreFormationAction(formationGuideId));
  const remove = () => {
    if (!formationGuideId) return;
    if (!window.confirm("Delete this draft permanently? This cannot be undone.")) return;
    runAction(() => deleteFormationAction(formationGuideId));
  };

  const fieldError = (key: string) => errors[key];

  return (
    <div>
      <EditorHeader
        status={status}
        viewHref={form.slug ? `/formations/${form.slug}` : null}
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
          description="The public URL and basic identification of the formation guide."
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
              hint="Public URL: /formations/… — suggested from the title."
              error={fieldError("slug")}
            />
            <TextField
              label="Formation"
              required={status === "PUBLISHED"}
              value={form.formation}
              onChange={(event) => set({ formation: event.target.value })}
              hint='e.g. "4-2-1-3"'
              error={fieldError("formation")}
            />
            <TextField
              label="Playstyle"
              required={status === "PUBLISHED"}
              value={form.playstyle}
              onChange={(event) => set({ playstyle: event.target.value })}
              hint='e.g. "Possession"'
              error={fieldError("playstyle")}
            />
          </div>
        </EditorSection>

        <EditorSection
          title="Overview"
          description="The general description and when to use this formation."
        >
          <div className="grid gap-4">
            <TextAreaField
              label="Description"
              required={status === "PUBLISHED"}
              rows={5}
              value={form.description}
              onChange={(event) => set({ description: event.target.value })}
              error={fieldError("description")}
            />
            <TextAreaField
              label="Recommended usage"
              required={status === "PUBLISHED"}
              rows={5}
              value={form.recommendedUsage}
              onChange={(event) => set({ recommendedUsage: event.target.value })}
              error={fieldError("recommendedUsage")}
            />
          </div>
        </EditorSection>

        <div className="grid gap-6 md:grid-cols-2">
          <EditorSection title="Tactical instructions">
            <StringListEditor
              label="Instruction list"
              values={form.tacticalInstructions}
              onChange={(tacticalInstructions) => set({ tacticalInstructions })}
              placeholder="e.g. Keep the front three narrow to overload the half-spaces"
              maxItems={10}
              maxItemLength={300}
              errors={errorsForKey("tacticalInstructions", errors)}
            />
          </EditorSection>
          <EditorSection title="Strengths">
            <StringListEditor
              label="Strength list"
              values={form.strengths}
              onChange={(strengths) => set({ strengths })}
              placeholder="e.g. Strong on the counter"
              maxItems={10}
              maxItemLength={300}
              errors={errorsForKey("strengths", errors)}
            />
          </EditorSection>
          <EditorSection title="Weaknesses">
            <StringListEditor
              label="Weakness list"
              values={form.weaknesses}
              onChange={(weaknesses) => set({ weaknesses })}
              placeholder="e.g. Exposed wide when pressing high"
              maxItems={10}
              maxItemLength={300}
              errors={errorsForKey("weaknesses", errors)}
            />
          </EditorSection>
          <EditorSection
            title="Key player roles"
            description="Position, then what the player should do."
          >
            <PairListEditor
              label="Role list"
              values={form.roles}
              onChange={(roles) => set({ roles })}
              firstLabel="Position"
              secondLabel="Role description"
              firstPlaceholder="e.g. AMF"
              secondPlaceholder="What the player should do…"
              maxItems={12}
              errors={errorsForKey("roles", errors)}
            />
          </EditorSection>
        </div>

        <EditorSection
          title="Media"
          description="Videos and images for the formation guide, in display order."
        >
          <MediaEditor
            items={form.media}
            onChange={(media) => set({ media })}
            errors={errors}
            emptyHint="No media yet. The first video is featured at the top of the guide."
          />
        </EditorSection>

        <EditorSection
          title="Research / Article content"
          description="Build an editorial article with headings, paragraphs, media (single or side-by-side), custom attributes and custom sections. Blocks render in exactly this order on the public page, after the formation overview."
        >
          <BlockEditor
            items={form.blocks}
            onChange={(blocks) => set({ blocks })}
            errors={errors}
          />
        </EditorSection>
      </div>

      <EditorFooter
        listHref="/admin/formations"
        pending={pending}
        onSaveDraft={() => save("DRAFT")}
        onPublish={() => save("PUBLISHED")}
      />
    </div>
  );
}