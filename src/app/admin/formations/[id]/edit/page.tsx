import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { FormationEditorForm } from "@/components/admin/formation-editor/formation-editor-form";
import { getFormationById } from "@/lib/db/repositories/formations.repo";
import { formationFormStateFromDto } from "@/lib/formation-editor/transform";

export const metadata: Metadata = {
  title: "Edit formation",
};

export const dynamic = "force-dynamic";

export default async function EditFormationPage({
  params,
}: PageProps<"/admin/formations/[id]/edit">) {
  const { id } = await params;
  const formation = await getFormationById(id);
  if (!formation) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Formations"
        title={formation.title}
        description={`${formation.formation} · ${formation.playstyle} — drafts stay hidden until published.`}
        actions={
          <Button variant="ghost" href="/admin/formations">
            Back to formations
          </Button>
        }
      />
      <div className="mt-8">
        <FormationEditorForm
          formationGuideId={formation.id}
          initial={formationFormStateFromDto(formation)}
          status={formation.status}
        />
      </div>
    </div>
  );
}