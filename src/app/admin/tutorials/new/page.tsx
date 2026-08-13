import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { TutorialEditorForm } from "@/components/admin/tutorial-editor/tutorial-editor-form";

export const metadata: Metadata = {
  title: "New tutorial",
};

export default function NewTutorialPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Tutorials"
        title="New tutorial"
        description="Draft tutorials stay hidden from the public site until you publish them."
        actions={
          <Button variant="ghost" href="/admin/tutorials">
            Back to tutorials
          </Button>
        }
      />
      <div className="mt-8">
        <TutorialEditorForm />
      </div>
    </div>
  );
}