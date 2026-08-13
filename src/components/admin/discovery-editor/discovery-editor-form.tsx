"use client";

import { useState } from "react";
import type { PublishStatus } from "@/generated/prisma/client";
import { slugify } from "@/lib/build-editor/slug";
import { emptyDiscoveryFormState } from "@/lib/discovery-editor/transform";
import type {
  DiscoveryEditorFormState,
  DiscoveryEditorInput,
} from "@/lib/discovery-editor/types";
import {
  archiveDiscoveryAction,
  createDiscoveryAction,
  deleteDiscoveryAction,
  restoreDiscoveryAction,
  updateDiscoveryAction,
} from "@/app/admin/discoveries/actions";
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
  DISCOVERY_CATEGORY_OPTIONS,
  RESEARCH_STATUS_OPTIONS,
} from "@/lib/content-editor/labels";

type DiscoveryEditorFormProps = {
  discoveryId?: string;
  initial?: DiscoveryEditorFormState;
  status?: PublishStatus;
};

function toInput(
  form: DiscoveryEditorFormState,
  status: "DRAFT" | "PUBLISHED"
): DiscoveryEditorInput {
  return {
    title: form.title,
    slug: form.slug,
    category: form.category as DiscoveryEditorInput["category"],
    excerpt: form.excerpt,
    content: form.content,
    findings: form.findings,
    author: form.author,
    sources: form.sources,
    researchStatus: form.researchStatus as DiscoveryEditorInput["researchStatus"],
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

export function DiscoveryEditorForm({
  discoveryId,
  initial,
  status,
}: DiscoveryEditorFormProps) {
  const [form, setForm] = useState<DiscoveryEditorFormState>(
    initial ?? emptyDiscoveryFormState()
  );
  const { pending, errors, actionError, runAction } = useEditorAction();

  const set = (patch: Partial<DiscoveryEditorFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleTitle = (value: string) =>
    setForm((current) => ({
      ...current,
      title: value,
      slug: current.slugTouched ? current.slug : slugify(value),
    }));

  const save = (target: "DRAFT" | "PUBLISHED") => {
    const input = toInput(form, target);
    const action = discoveryId
      ? () => updateDiscoveryAction(discoveryId, input)
      : () => createDiscoveryAction(input);
    runAction(action);
  };

  const archive = () =>
    discoveryId && runAction(() => archiveDiscoveryAction(discoveryId));
  const restore = () =>
    discoveryId && runAction(() => restoreDiscoveryAction(discoveryId));
  const remove = () => {
    if (!discoveryId) return;
    if (!window.confirm("Delete this draft permanently? This cannot be undone.")) return;
    runAction(() => deleteDiscoveryAction(discoveryId));
  };

  const fieldError = (key: string) => errors[key];

  return (
    <div>
      <EditorHeader
        status={status}
        viewHref={form.slug ? `/discoveries/${form.slug}` : null}
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
          description="The public URL and categorization of the discovery."
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
              hint="Public URL: /discoveries/… — suggested from the title."
              error={fieldError("slug")}
            />
            <SelectField
              label="Category"
              required={status === "PUBLISHED"}
              value={form.category}
              onChange={(event) =>
                set({
                  category: event.target.value as DiscoveryEditorFormState["category"],
                })
              }
              error={fieldError("category")}
              options={[
                { value: "", label: "Choose category" },
                ...DISCOVERY_CATEGORY_OPTIONS,
              ]}
            />
            <SelectField
              label="Research status"
              required={status === "PUBLISHED"}
              value={form.researchStatus}
              onChange={(event) =>
                set({
                  researchStatus: event.target.value as DiscoveryEditorFormState["researchStatus"],
                })
              }
              error={fieldError("researchStatus")}
              options={[
                { value: "", label: "Choose research status" },
                ...RESEARCH_STATUS_OPTIONS,
              ]}
            />
            <TextField
              label="Author"
              required={status === "PUBLISHED"}
              value={form.author}
              onChange={(event) => set({ author: event.target.value })}
              hint='e.g. "RemianRon"'
              error={fieldError("author")}
            />
          </div>
        </EditorSection>

        <EditorSection
          title="Content"
          description="The excerpt shows in discovery lists; the content is the body. Separate paragraphs with a blank line."
        >
          <div className="grid gap-4">
            <TextAreaField
              label="Excerpt"
              required={status === "PUBLISHED"}
              rows={3}
              value={form.excerpt}
              onChange={(event) => set({ excerpt: event.target.value })}
              error={fieldError("excerpt")}
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
          <EditorSection
            title="Findings"
            description="Optional bullet points summarizing what the research found."
          >
            <StringListEditor
              label="Finding list"
              values={form.findings}
              onChange={(findings) => set({ findings })}
              placeholder="e.g. 9/10 midfielders prefer a false-nine setup in tight spaces"
              maxItems={12}
              maxItemLength={500}
              errors={errorsForKey("findings", errors)}
            />
          </EditorSection>
          <EditorSection
            title="Sources"
            description="Reference links and attributions for the discovery."
          >
            <StringListEditor
              label="Source list"
              values={form.sources}
              onChange={(sources) => set({ sources })}
              placeholder="https://…"
              maxItems={12}
              maxItemLength={300}
              errors={errorsForKey("sources", errors)}
            />
          </EditorSection>
        </div>

        <EditorSection
          title="Media"
          description="Videos and images for the discovery, in display order."
        >
          <MediaEditor
            items={form.media}
            onChange={(media) => set({ media })}
            errors={errors}
            emptyHint="No media yet. The first video is featured at the top of the discovery."
          />
        </EditorSection>
      </div>

      <EditorFooter
        listHref="/admin/discoveries"
        pending={pending}
        onSaveDraft={() => save("DRAFT")}
        onPublish={() => save("PUBLISHED")}
      />
    </div>
  );
}