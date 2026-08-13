import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { BuildEditorForm } from "@/components/admin/build-editor/build-editor-form";
import { listActiveAttributes } from "@/lib/db/repositories/attributes.repo";
import { getBuildById } from "@/lib/db/repositories/builds.repo";
import { formStateFromBuild } from "@/lib/build-editor/transform";

export const metadata: Metadata = {
  title: "Edit build",
};

export default async function EditBuildPage({
  params,
}: PageProps<"/admin/builds/[id]/edit">) {
  const { id } = await params;
  const build = await getBuildById(id);
  if (!build) notFound();

  const catalog = await listActiveAttributes();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Builds"
        title={build.buildName}
        description={`${build.card.player.name} · ${build.card.cardName} · ${build.card.position} — changes apply to the shared player card where appropriate.`}
        actions={
          <Button variant="ghost" href="/admin/builds">
            Back to builds
          </Button>
        }
      />
      <div className="mt-8">
        <BuildEditorForm
          catalog={catalog}
          buildId={build.id}
          initial={formStateFromBuild(build)}
          status={build.status}
        />
      </div>
    </div>
  );
}