import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { FeaturedEditorForm } from "@/components/admin/featured-editor/featured-editor-form";
import { getFeaturedCatalog } from "@/lib/db/repositories/featured.repo";

export const metadata: Metadata = {
  title: "New featured item",
};

export const dynamic = "force-dynamic";

export default async function NewFeaturedItemPage() {
  const catalog = await getFeaturedCatalog();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        eyebrow="Featured Content"
        title="New featured item"
        description="Feature published content on the homepage. The picker only lists published items."
        actions={
          <Button variant="ghost" href="/admin/featured">
            Back to featured
          </Button>
        }
      />
      <div className="mt-8">
        <FeaturedEditorForm catalog={catalog} />
      </div>
    </div>
  );
}