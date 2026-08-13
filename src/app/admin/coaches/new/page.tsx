import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { CoachEditorForm } from "@/components/admin/coach-editor/coach-editor-form";

export const metadata: Metadata = {
  title: "New coach",
};

export default function NewCoachPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Coaches"
        title="New coach profile"
        description="Drafts stay hidden from the public site until you publish them."
        actions={
          <Button variant="ghost" href="/admin/coaches">
            Back to coaches
          </Button>
        }
      />
      <div className="mt-8">
        <CoachEditorForm />
      </div>
    </div>
  );
}