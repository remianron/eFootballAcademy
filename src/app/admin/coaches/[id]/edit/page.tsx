import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { CoachEditorForm } from "@/components/admin/coach-editor/coach-editor-form";
import { getCoachById } from "@/lib/db/repositories/coaches.repo";
import { coachFormStateFromDto } from "@/lib/coach-editor/transform";

export const metadata: Metadata = {
  title: "Edit coach",
};

export const dynamic = "force-dynamic";

export default async function EditCoachPage({
  params,
}: PageProps<"/admin/coaches/[id]/edit">) {
  const { id } = await params;
  const coach = await getCoachById(id);
  if (!coach) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Coaches"
        title={coach.name}
        description="Drafts stay hidden until published."
        actions={
          <Button variant="ghost" href="/admin/coaches">
            Back to coaches
          </Button>
        }
      />
      <div className="mt-8">
        <CoachEditorForm
          coachId={coach.id}
          initial={coachFormStateFromDto(coach)}
          status={coach.status}
        />
      </div>
    </div>
  );
}