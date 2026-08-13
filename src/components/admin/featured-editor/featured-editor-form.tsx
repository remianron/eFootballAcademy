"use client";

import { useState } from "react";
import {
  createFeaturedItemAction,
  updateFeaturedItemAction,
} from "@/app/admin/featured/actions";
import {
  EditorFooter,
  EditorSection,
  useEditorAction,
} from "@/components/admin/content-editor";
import {
  CheckboxField,
  NumberField,
  SelectField,
} from "@/components/admin/form";
import {
  FEATURED_CONTENT_TYPE_OPTIONS,
  FEATURED_PLACEMENT_OPTIONS,
} from "@/lib/content-editor/labels";
import { emptyFeaturedFormState } from "@/lib/featured-editor/transform";
import type {
  FeaturedCatalog,
  FeaturedEditorFormState,
  FeaturedEditorInput,
} from "@/lib/featured-editor/types";

type FeaturedEditorFormProps = {
  catalog: FeaturedCatalog;
  featuredItemId?: string;
  initial?: FeaturedEditorFormState;
};

function toInput(form: FeaturedEditorFormState): FeaturedEditorInput {
  return {
    contentType: form.contentType as FeaturedEditorInput["contentType"],
    contentId: form.contentId,
    placement: form.placement as FeaturedEditorInput["placement"],
    order: Number(form.order) || 0,
    active: form.active,
  };
}

export function FeaturedEditorForm({
  catalog,
  featuredItemId,
  initial,
}: FeaturedEditorFormProps) {
  const [form, setForm] = useState<FeaturedEditorFormState>(
    initial ?? emptyFeaturedFormState()
  );
  const { pending, errors, actionError, runAction } = useEditorAction();

  const set = (patch: Partial<FeaturedEditorFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const contentOptions = form.contentType
    ? catalog[form.contentType].map((item) => ({
        value: item.id,
        label: `${item.title} (${item.slug})`,
      }))
    : [];

  const save = () => {
    const input = toInput(form);
    const action = featuredItemId
      ? () => updateFeaturedItemAction(featuredItemId, input)
      : () => createFeaturedItemAction(input);
    runAction(action);
  };

  return (
    <div>
      {actionError && (
        <div className="mb-6 rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      )}

      <EditorSection
        title="Featured item"
        description="Pick published content, choose where it appears on the homepage and set its sort order."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Content type"
            required
            value={form.contentType}
            onChange={(event) =>
              set({
                contentType: event.target.value as FeaturedEditorFormState["contentType"],
                contentId: "",
              })
            }
            disabled={featuredItemId !== undefined}
            hint="The picker only lists published content."
            error={errors.contentType}
            options={[
              { value: "", label: "Choose content type" },
              ...FEATURED_CONTENT_TYPE_OPTIONS,
            ]}
          />
          <div className="flex items-end">
            <SelectField
              label="Content"
              required
              value={form.contentId}
              onChange={(event) => set({ contentId: event.target.value })}
              disabled={!form.contentType || pending}
              error={errors.contentId}
              options={[
                { value: "", label: "Choose content" },
                ...contentOptions,
              ]}
            />
          </div>
          <SelectField
            label="Placement"
            required
            value={form.placement}
            onChange={(event) =>
              set({
                placement: event.target.value as FeaturedEditorFormState["placement"],
              })
            }
            error={errors.placement}
            options={[
              { value: "", label: "Choose placement" },
              ...FEATURED_PLACEMENT_OPTIONS,
            ]}
          />
          <NumberField
            label="Order"
            required
            min={0}
            max={99}
            value={form.order}
            onChange={(event) => set({ order: event.target.value })}
            hint="Lower numbers appear first within the placement."
            error={errors.order}
          />
        </div>
        <div className="mt-4">
          <CheckboxField
            label="Active"
            checked={form.active}
            onCheckedChange={(active) => set({ active })}
            hint="Inactive items are reserved and not visible on the public site."
          />
        </div>
      </EditorSection>

      <EditorFooter
        listHref="/admin/featured"
        pending={pending}
        draft={false}
        onPublish={save}
        publishLabel="Save"
      />
    </div>
  );
}