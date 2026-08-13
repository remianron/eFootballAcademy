import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { TutorialEditorForm } from "@/components/admin/tutorial-editor/tutorial-editor-form";
import { getTutorialById } from "@/lib/db/repositories/tutorials.repo";
import { tutorialFormStateFromDto } from "@/lib/tutorial-editor/transform";

export const metadata: Metadata = {
  title: "Edit tutorial",
};

export const dynamic = "force-dynamic";

export default async function EditTutorialPage({
  params,
}: PageProps<"/admin/tutorials/[id]/edit">) {
  const { id } = await params;
  const tutorial = await getTutorialById(id);
  if (!tutorial) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Tutorials"
        title={tutorial.title}
        description={`${tutorial.category} · ${tutorial.difficulty} — drafts stay hidden until published.`}
        actions={
          <Button variant="ghost" href="/admin/tutorials">
            Back to tutorials
          </Button>
        }
      />
      <div className="mt-8">
        <TutorialEditorForm
          tutorialId={tutorial.id}
          initial={tutorialFormStateFromDto(tutorial)}
          status={tutorial.status}
        />
      </div>
    </div>
  );
}