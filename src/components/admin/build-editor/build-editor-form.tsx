"use client";

import { useState } from "react";
import type { PublishStatus } from "@/generated/prisma/client";
import type { AttributeDto } from "@/lib/db/types";
import { emptyFormState } from "@/lib/build-editor/transform";
import { slugify } from "@/lib/build-editor/slug";
import type {
  BuildEditorFormState,
  BuildEditorInput,
  BuildEditorStatus,
} from "@/lib/build-editor/types";
import {
  archiveBuildAction,
  createBuildAction,
  deleteBuildAction,
  restoreBuildAction,
  updateBuildAction,
  type ActionErrors,
} from "@/app/admin/builds/actions";
import { AdminStatusBadge } from "@/components/admin";
import { Button } from "@/components";
import { IconExternalLink } from "@/components/icons";
import { EditorSection } from "@/components/admin/build-editor/section";
import { StatisticsEditor } from "@/components/admin/build-editor/statistics-editor";
import { KeyAttributesEditor } from "@/components/admin/build-editor/key-attributes-editor";
import { MediaEditor } from "@/components/admin/build-editor/media-editor";
import {
  NumberField,
  StringListEditor,
  TextAreaField,
  TextField,
} from "@/components/admin/form";

const STATUS_BADGE_MAP: Record<
  PublishStatus,
  "published" | "draft" | "archived"
> = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
};

type BuildEditorFormProps = {
  catalog: AttributeDto[];
  buildId?: string;
  initial?: BuildEditorFormState;
  status?: PublishStatus;
};

type ActionResult =
  | { ok: true }
  | { ok: false; errors?: ActionErrors; error?: string };

function toInput(
  form: BuildEditorFormState,
  status: BuildEditorStatus
): BuildEditorInput {
  return {
    playerName: form.playerName,
    playerSlug: form.playerSlug,
    cardName: form.cardName,
    rarity: form.rarity,
    position: form.position,
    overall: form.overall,
    buildName: form.buildName,
    buildSlug: form.buildSlug,
    playstyle: form.playstyle,
    shortDescription: form.shortDescription,
    philosophy: form.philosophy,
    skills: form.skills,
    recommendedFor: form.recommendedFor,
    avoidFor: form.avoidFor,
    statistics: form.statistics,
    keyAttributes: form.keyAttributes,
    strengths: form.strengths,
    weaknesses: form.weaknesses,
    screenshot: form.screenshot,
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

export function BuildEditorForm({
  catalog,
  buildId,
  initial,
  status,
}: BuildEditorFormProps) {
  const [form, setForm] = useState<BuildEditorFormState>(
    initial ?? emptyFormState()
  );
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<ActionErrors>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const set = (patch: Partial<BuildEditorFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handlePlayerName = (value: string) =>
    setForm((current) => ({
      ...current,
      playerName: value,
      playerSlug: current.playerSlugTouched
        ? current.playerSlug
        : slugify(value),
    }));

  const handleBuildName = (value: string) =>
    setForm((current) => ({
      ...current,
      buildName: value,
      buildSlug: current.buildSlugTouched ? current.buildSlug : slugify(value),
    }));

  async function runAction(action: () => Promise<ActionResult>) {
    setPending(true);
    setErrors({});
    setActionError(null);
    try {
      const result = await action();
      if (result && "ok" in result && !result.ok) {
        if ("errors" in result && result.errors) {
          setErrors(result.errors);
        } else if ("error" in result && result.error) {
          setActionError(result.error);
        }
      }
    } finally {
      setPending(false);
    }
  }

  const saveDraft = () =>
    runAction(() =>
      buildId
        ? updateBuildAction(buildId, toInput(form, "DRAFT"))
        : createBuildAction(toInput(form, "DRAFT"))
    );

  const publish = () =>
    runAction(() =>
      buildId
        ? updateBuildAction(buildId, toInput(form, "PUBLISHED"))
        : createBuildAction(toInput(form, "PUBLISHED"))
    );

  const archive = () =>
    buildId && runAction(() => archiveBuildAction(buildId));

  const restore = () =>
    buildId && runAction(() => restoreBuildAction(buildId));

  const remove = () => {
    if (!buildId) return;
    if (!window.confirm("Delete this draft permanently? This cannot be undone.")) {
      return;
    }
    runAction(() => deleteBuildAction(buildId!));
  };

  const fieldError = (key: string) => errors[key];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {status && <AdminStatusBadge status={STATUS_BADGE_MAP[status]} />}
          {form.buildSlug && (
            <a
              href={`/builds/${form.buildSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-electric"
            >
              View on site
              <IconExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {buildId && (
          <div className="flex items-center gap-2">
            {status === "DRAFT" && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={pending}
                onClick={remove}
              >
                Delete draft
              </Button>
            )}
            {status === "ARCHIVED" ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={restore}
              >
                Restore as draft
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={archive}
              >
                Archive
              </Button>
            )}
          </div>
        )}
      </div>

      {actionError && (
        <div className="mb-6 rounded-control border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      )}

      <div className="space-y-6">
        <EditorSection
          title="Player & card"
          description="A player card can carry multiple builds. Position and overall live on the card and are shared by every build of it."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Player name"
              required
              value={form.playerName}
              onChange={(event) => handlePlayerName(event.target.value)}
              error={fieldError("playerName")}
            />
            <TextField
              label="Player slug"
              required
              value={form.playerSlug}
              onChange={(event) => {
                set({ playerSlug: slugify(event.target.value), playerSlugTouched: true });
              }}
              hint="Lowercase letters, numbers and dashes. Suggesting from the player name — edit to rename the player."
              error={fieldError("playerSlug")}
            />
            <TextField
              label="Card name"
              required
              value={form.cardName}
              onChange={(event) => set({ cardName: event.target.value })}
              error={fieldError("cardName")}
            />
            <TextField
              label="Rarity (optional)"
              value={form.rarity}
              onChange={(event) => set({ rarity: event.target.value })}
              placeholder="e.g. Epic, Featured"
              error={fieldError("rarity")}
            />
            <TextField
              label="Position"
              required
              value={form.position}
              onChange={(event) => set({ position: event.target.value })}
              placeholder="e.g. CF, AMF, GK"
              error={fieldError("position")}
            />
            <NumberField
              label="Overall"
              required
              min={0}
              max={99}
              value={form.overall}
              onChange={(event) => set({ overall: event.target.value })}
              error={fieldError("overall")}
            />
          </div>
        </EditorSection>

        <EditorSection
          title="Build identity"
          description="The build is one variant of the card — a playstyle interpretation with its own statistics and advice."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Build name"
              required
              value={form.buildName}
              onChange={(event) => handleBuildName(event.target.value)}
              placeholder="e.g. Sole Control"
              error={fieldError("buildName")}
            />
            <TextField
              label="Build slug"
              required
              value={form.buildSlug}
              onChange={(event) => {
                set({ buildSlug: slugify(event.target.value), buildSlugTouched: true });
              }}
              hint="Public URL: /builds/… — suggest from the build name."
              error={fieldError("buildSlug")}
            />
            <TextField
              label="Playstyle (optional)"
              value={form.playstyle}
              onChange={(event) => set({ playstyle: event.target.value })}
              placeholder="e.g. Possession, Long Ball Counter"
              error={fieldError("playstyle")}
              className="sm:col-span-2"
            />
          </div>
        </EditorSection>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <EditorSection
            title="Progression screenshot"
            description="One reference image that represents this build, saved as the primary media item."
          >
            <div className="grid gap-4">
              <TextField
                label="Image URL"
                value={form.screenshot.url}
                onChange={(event) =>
                  set({ screenshot: { ...form.screenshot, url: event.target.value } })
                }
                placeholder="https://…"
                error={fieldError("screenshot.url")}
              />
              <TextField
                label="Alt text"
                value={form.screenshot.alt}
                maxLength={200}
                onChange={(event) =>
                  set({ screenshot: { ...form.screenshot, alt: event.target.value } })
                }
                error={fieldError("screenshot.alt")}
              />
              <TextField
                label="Caption"
                value={form.screenshot.caption}
                maxLength={300}
                onChange={(event) =>
                  set({ screenshot: { ...form.screenshot, caption: event.target.value } })
                }
                error={fieldError("screenshot.caption")}
              />
            </div>
          </EditorSection>

          <EditorSection
            title="Analysis"
            description="The short description appears in lists; the philosophy explains the build in depth on its page."
          >
            <div className="grid gap-4">
              <TextAreaField
                label="Short description"
                required={status === "PUBLISHED"}
                rows={3}
                value={form.shortDescription}
                onChange={(event) => set({ shortDescription: event.target.value })}
                error={fieldError("shortDescription")}
              />
              <TextAreaField
                label="Philosophy"
                required={status === "PUBLISHED"}
                rows={8}
                value={form.philosophy}
                onChange={(event) => set({ philosophy: event.target.value })}
                error={fieldError("philosophy")}
              />
            </div>
          </EditorSection>
        </div>

        <EditorSection
          title="Statistics"
          description="Values from 0 to 101, directly on the attribute catalog. Leave empty to clear."
        >
          <StatisticsEditor
            catalog={catalog}
            values={form.statistics}
            onChange={(statistics) => set({ statistics })}
            errors={errors}
          />
        </EditorSection>

        <EditorSection
          title="Key attributes"
          description="Highlight a few attributes on the build page. Order matters — they appear top to bottom. No duplicate values are stored."
        >
          <KeyAttributesEditor
            catalog={catalog}
            values={form.statistics}
            selected={form.keyAttributes}
            onChange={(keyAttributes) => set({ keyAttributes })}
            errors={errors}
          />
        </EditorSection>

        <div className="grid gap-6 md:grid-cols-2">
          <EditorSection title="Strengths">
            <StringListEditor
              label="Strength list"
              values={form.strengths}
              onChange={(strengths) => set({ strengths })}
              placeholder="e.g. First-time shot accuracy"
              maxItems={10}
              maxItemLength={160}
              errors={errorsForKey("strengths", errors)}
            />
          </EditorSection>
          <EditorSection title="Weaknesses">
            <StringListEditor
              label="Weakness list"
              values={form.weaknesses}
              onChange={(weaknesses) => set({ weaknesses })}
              placeholder="e.g. Weak foot accuracy"
              maxItems={10}
              maxItemLength={160}
              errors={errorsForKey("weaknesses", errors)}
            />
          </EditorSection>
        </div>

        <EditorSection
          title="Skills & context"
          description="Skills the build relies on, plus who it suits and who should avoid it."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <StringListEditor
              label="Skills"
              values={form.skills}
              onChange={(skills) => set({ skills })}
              placeholder="e.g. Double Touch"
              maxItems={12}
              maxItemLength={120}
              errors={errorsForKey("skills", errors)}
            />
            <div className="grid gap-6">
              <StringListEditor
                label="Recommended for"
                values={form.recommendedFor}
                onChange={(recommendedFor) => set({ recommendedFor })}
                placeholder="e.g. Players who rely on tight dribbling"
                maxItems={10}
                maxItemLength={160}
                errors={errorsForKey("recommendedFor", errors)}
              />
              <StringListEditor
                label="Avoid for"
                values={form.avoidFor}
                onChange={(avoidFor) => set({ avoidFor })}
                placeholder="e.g. Cross-heavy tactics"
                maxItems={10}
                maxItemLength={160}
                errors={errorsForKey("avoidFor", errors)}
              />
            </div>
          </div>
        </EditorSection>

        <EditorSection
          title="Additional media"
          description="More videos and images for the build page, in display order. The progression screenshot is set above."
        >
          <MediaEditor
            items={form.media}
            onChange={(media) => set({ media })}
            errors={errors}
          />
        </EditorSection>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          size="md"
          href="/admin/builds"
        >
          Back to builds
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={saveDraft}
          >
            Save draft
          </Button>
          <Button type="button" disabled={pending} onClick={publish}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}

function errorsForKey(prefix: string, errors: ActionErrors): Record<number, string> {
  const result: Record<number, string> = {};
  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(`${prefix}.`)) {
      const index = Number(key.slice(prefix.length + 1));
      if (Number.isInteger(index)) result[index] = message;
    }
  }
  return result;
}