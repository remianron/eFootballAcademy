import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { DiscoveryEditorForm } from "@/components/admin/discovery-editor/discovery-editor-form";

export const metadata: Metadata = {
  title: "New discovery",
};

export default function NewDiscoveryPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Discoveries"
        title="New discovery"
        description="Drafts stay hidden from the public site until you publish them."
        actions={
          <Button variant="ghost" href="/admin/discoveries">
            Back to discoveries
          </Button>
        }
      />
      <div className="mt-8">
        <DiscoveryEditorForm />
      </div>
    </div>
  );
}