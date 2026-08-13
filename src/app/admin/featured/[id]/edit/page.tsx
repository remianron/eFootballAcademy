import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { FeaturedEditorForm } from "@/components/admin/featured-editor/featured-editor-form";
import {
  getFeaturedCatalog,
  getFeaturedEntryById,
} from "@/lib/db/repositories/featured.repo";
import { featuredFormStateFromDto } from "@/lib/featured-editor/transform";

export const metadata: Metadata = {
  title: "Edit featured item",
};

export const dynamic = "force-dynamic";

export default async function EditFeaturedItemPage({
  params,
}: PageProps<"/admin/featured/[id]/edit">) {
  const { id } = await params;
  const entry = await getFeaturedEntryById(id);
  if (!entry) notFound();

  const catalog = await getFeaturedCatalog();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        eyebrow="Featured Content"
        title={entry.content?.title ?? "Featured item"}
        description="Placement, order and visibility of this item on the homepage."
        actions={
          <Button variant="ghost" href="/admin/featured">
            Back to featured
          </Button>
        }
      />
      <div className="mt-8">
        <FeaturedEditorForm
          catalog={catalog}
          featuredItemId={entry.id}
          initial={featuredFormStateFromDto(entry)}
        />
      </div>
    </div>
  );
}