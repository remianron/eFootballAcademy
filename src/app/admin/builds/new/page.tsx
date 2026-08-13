import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { BuildEditorForm } from "@/components/admin/build-editor/build-editor-form";
import { listActiveAttributes } from "@/lib/db/repositories/attributes.repo";

export const metadata: Metadata = {
  title: "New build",
};

export const dynamic = "force-dynamic";

export default async function NewBuildPage() {
  const catalog = await listActiveAttributes();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Builds"
        title="New build"
        description="Draft builds stay hidden from the public site until you publish them. Save early — statistics and media can be added at any time."
        actions={
          <Button variant="ghost" href="/admin/builds">
            Back to builds
          </Button>
        }
      />
      <div className="mt-8">
        <BuildEditorForm catalog={catalog} />
      </div>
    </div>
  );
}