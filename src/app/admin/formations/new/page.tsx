import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { FormationEditorForm } from "@/components/admin/formation-editor/formation-editor-form";

export const metadata: Metadata = {
  title: "New formation",
};

export default function NewFormationPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Formations"
        title="New formation guide"
        description="Drafts stay hidden from the public site until you publish them."
        actions={
          <Button variant="ghost" href="/admin/formations">
            Back to formations
          </Button>
        }
      />
      <div className="mt-8">
        <FormationEditorForm />
      </div>
    </div>
  );
}