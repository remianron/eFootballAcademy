import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { DiscoveryEditorForm } from "@/components/admin/discovery-editor/discovery-editor-form";
import { getDiscoveryById } from "@/lib/db/repositories/discoveries.repo";
import { discoveryFormStateFromDto } from "@/lib/discovery-editor/transform";
import {
  DISCOVERY_CATEGORY_LABELS,
  RESEARCH_STATUS_LABELS,
} from "@/lib/content-editor/labels";

export const metadata: Metadata = {
  title: "Edit discovery",
};

export const dynamic = "force-dynamic";

export default async function EditDiscoveryPage({
  params,
}: PageProps<"/admin/discoveries/[id]/edit">) {
  const { id } = await params;
  const discovery = await getDiscoveryById(id);
  if (!discovery) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        eyebrow="Discoveries"
        title={discovery.title}
        description={`${DISCOVERY_CATEGORY_LABELS[discovery.category]} · ${RESEARCH_STATUS_LABELS[discovery.researchStatus]} — drafts stay hidden until published.`}
        actions={
          <Button variant="ghost" href="/admin/discoveries">
            Back to discoveries
          </Button>
        }
      />
      <div className="mt-8">
        <DiscoveryEditorForm
          discoveryId={discovery.id}
          initial={discoveryFormStateFromDto(discovery)}
          status={discovery.status}
        />
      </div>
    </div>
  );
}