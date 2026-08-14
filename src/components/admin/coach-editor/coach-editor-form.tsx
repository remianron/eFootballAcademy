"use client";

import { useState } from "react";
import type { PublishStatus } from "@/generated/prisma/client";
import { slugify } from "@/lib/build-editor/slug";
import { emptyCoachFormState } from "@/lib/coach-editor/transform";
import type {
  CoachEditorFormState,
  CoachEditorInput,
} from "@/lib/coach-editor/types";
import {
  archiveCoachAction,
  createCoachAction,
  deleteCoachAction,
  restoreCoachAction,
  updateCoachAction,
} from "@/app/admin/coaches/actions";
import {
  EditorFooter,
  EditorHeader,
  EditorSection,
  errorsForKey,
  useEditorAction,
} from "@/components/admin/content-editor";
import {
  BlockEditor,
  CheckboxField,
  MediaEditor,
  PairListEditor,
  StringListEditor,
  TextAreaField,
  TextField,
} from "@/components/admin/form";

type CoachEditorFormProps = {
  coachId?: string;
  initial?: CoachEditorFormState;
  status?: PublishStatus;
};

function toInput(
  form: CoachEditorFormState,
  status: "DRAFT" | "PUBLISHED"
): CoachEditorInput {
  return {
    name: form.name,
    slug: form.slug,
    bio: form.bio,
    coachingDescription: form.coachingDescription,
    specialties: form.specialties,
    bookingEnabled: form.bookingEnabled,
    socialLinks: form.socialLinks.map((link) => ({
      platform: link.first,
      url: link.second,
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

export function CoachEditorForm({
  coachId,
  initial,
  status,
}: CoachEditorFormProps) {
  const [form, setForm] = useState<CoachEditorFormState>(
    initial ?? emptyCoachFormState()
  );
  const { pending, errors, actionError, runAction } = useEditorAction();

  const set = (patch: Partial<CoachEditorFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleName = (value: string) =>
    setForm((current) => ({
      ...current,
      name: value,
      slug: current.slugTouched ? current.slug : slugify(value),
    }));

  const save = (target: "DRAFT" | "PUBLISHED") => {
    const input = toInput(form, target);
    const action = coachId
      ? () => updateCoachAction(coachId, input)
      : () => createCoachAction(input);
    runAction(action);
  };

  const archive = () => coachId && runAction(() => archiveCoachAction(coachId));
  const restore = () => coachId && runAction(() => restoreCoachAction(coachId));
  const remove = () => {
    if (!coachId) return;
    if (!window.confirm("Delete this draft permanently? This cannot be undone.")) return;
    runAction(() => deleteCoachAction(coachId));
  };

  const fieldError = (key: string) => errors[key];

  return (
    <div>
      <EditorHeader
        status={status}
        viewHref={form.slug ? `/coaching/${form.slug}` : null}
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
          description="The public URL and name of the coach profile."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Name"
              required
              value={form.name}
              onChange={(event) => handleName(event.target.value)}
              error={fieldError("name")}
            />
            <TextField
              label="Slug"
              required
              value={form.slug}
              onChange={(event) => {
                set({ slug: slugify(event.target.value), slugTouched: true });
              }}
              hint="Public URL: /coaching/… — suggested from the name."
              error={fieldError("slug")}
            />
            <CheckboxField
              label="Booking enabled"
              checked={form.bookingEnabled}
              onCheckedChange={(bookingEnabled) => set({ bookingEnabled })}
              hint="Lets visitors request a coaching session from the public profile. Scheduling and payment are arranged directly with the coach."
            />
          </div>
        </EditorSection>

        <EditorSection
          title="About the coach"
          description="The bio shows on the coaching list; the description explains the coaching philosophy."
        >
          <div className="grid gap-4">
            <TextAreaField
              label="Bio"
              required={status === "PUBLISHED"}
              rows={4}
              value={form.bio}
              onChange={(event) => set({ bio: event.target.value })}
              error={fieldError("bio")}
            />
            <TextAreaField
              label="Coaching description"
              required={status === "PUBLISHED"}
              rows={6}
              value={form.coachingDescription}
              onChange={(event) =>
                set({ coachingDescription: event.target.value })
              }
              error={fieldError("coachingDescription")}
            />
          </div>
        </EditorSection>

        <EditorSection title="Specialties">
          <StringListEditor
            label="Specialty list"
            values={form.specialties}
            onChange={(specialties) => set({ specialties })}
            placeholder="e.g. Free kicks, dribbling, 1v1 defending"
            maxItems={12}
            maxItemLength={300}
            errors={errorsForKey("specialties", errors)}
          />
        </EditorSection>

        <EditorSection
          title="Social links"
          description="Platform and URL pairs, in display order."
        >
          <PairListEditor
            label="Link list"
            values={form.socialLinks}
            onChange={(socialLinks) => set({ socialLinks })}
            firstLabel="Platform"
            secondLabel="URL"
            firstPlaceholder="e.g. YouTube"
            secondPlaceholder="https://…"
            maxItems={8}
            errors={errorsForKey("socialLinks", errors)}
          />
        </EditorSection>

        <EditorSection
          title="Media"
          description="Videos and images for the coach profile, in display order."
        >
          <MediaEditor
            items={form.media}
            onChange={(media) => set({ media })}
            errors={errors}
            emptyHint="No media yet. The first video is featured at the top of the profile."
          />
        </EditorSection>

        <EditorSection
          title="Article content"
          description="Add headings, paragraphs, media (single or side-by-side), custom attributes and custom sections. Blocks render in exactly this order on the public profile, after the coaching description."
        >
          <BlockEditor
            items={form.blocks}
            onChange={(blocks) => set({ blocks })}
            errors={errors}
          />
        </EditorSection>
      </div>

      <EditorFooter
        listHref="/admin/coaches"
        pending={pending}
        onSaveDraft={() => save("DRAFT")}
        onPublish={() => save("PUBLISHED")}
      />
    </div>
  );
}