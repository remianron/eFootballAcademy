"use client";

import { useState } from "react";
import { Button } from "@/components";
import {
  CheckboxField,
  NumberField,
  TextField,
} from "@/components/admin/form";
import { useEditorAction } from "@/components/admin/content-editor";
import { emptySiteSocialLinkFormState } from "@/lib/social-links/transform";
import type {
  SiteSocialLinkFormState,
  SiteSocialLinkInput,
} from "@/lib/social-links/types";
import {
  createSiteSocialLinkAction,
  updateSiteSocialLinkAction,
} from "@/app/admin/social/actions";

type SocialLinkFormProps = {
  linkId?: string;
  initial?: SiteSocialLinkFormState;
};

function toInput(form: SiteSocialLinkFormState): SiteSocialLinkInput {
  return {
    platform: form.platform,
    label: form.label,
    url: form.url,
    published: form.published,
    sortOrder: Number(form.sortOrder) || 1,
  };
}

export function SocialLinkForm({ linkId, initial }: SocialLinkFormProps) {
  const [form, setForm] = useState<SiteSocialLinkFormState>(
    initial ?? emptySiteSocialLinkFormState()
  );
  const { pending, errors, actionError, runAction } = useEditorAction();

  const set = (patch: Partial<SiteSocialLinkFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const save = () => {
    const input = toInput(form);
    runAction(
      linkId
        ? () => updateSiteSocialLinkAction(linkId, input)
        : () => createSiteSocialLinkAction(input)
    );
  };

  return (
    <div>
      {actionError && (
        <div className="mb-6 rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Platform"
            required
            value={form.platform}
            maxLength={32}
            onChange={(event) => set({ platform: event.target.value })}
            placeholder="e.g. YouTube, Instagram, Discord"
            hint="Used to pick the icon in the floating widget. New platforms work without code changes."
            error={errors.platform}
          />
          <TextField
            label="Label"
            required
            value={form.label}
            maxLength={64}
            onChange={(event) => set({ label: event.target.value })}
            placeholder="e.g. YouTube"
            hint="Shown in the footer and as the widget tooltip."
            error={errors.label}
          />
        </div>

        <TextField
          label="URL"
          required
          value={form.url}
          maxLength={2048}
          onChange={(event) => set({ url: event.target.value })}
          placeholder="https://…"
          hint="Must be a valid https:// URL — placeholder links like # are rejected."
          error={errors.url}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Display order"
            required
            min={1}
            max={99}
            value={form.sortOrder}
            onChange={(event) => set({ sortOrder: event.target.value })}
            hint="Lower numbers appear first. Orders are renumbered automatically."
            error={errors.sortOrder}
          />
          <div className="sm:pt-6">
            <CheckboxField
              label="Published — visible on the public site"
              checked={form.published}
              onCheckedChange={(published) => set({ published })}
              hint="Unpublished links never render in the footer or floating widget."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save social link"}
          </Button>
          <Button variant="ghost" href="/admin/social">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}