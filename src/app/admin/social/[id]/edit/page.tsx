import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { SocialLinkForm } from "@/components/admin/social-editor/social-link-form";
import { getSiteSocialLinkById } from "@/lib/db/repositories/social-links.repo";
import { siteSocialLinkFormStateFromDto } from "@/lib/social-links/transform";

export const metadata: Metadata = {
  title: "Edit social link",
};

export const dynamic = "force-dynamic";

export default async function EditSocialLinkPage({
  params,
}: PageProps<"/admin/social/[id]/edit">) {
  const { id } = await params;
  const link = await getSiteSocialLinkById(id);
  if (!link) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        eyebrow="Social Links"
        title={`Edit ${link.label}`}
        description={
          link.published
            ? "This link is live on the public site."
            : "This link is hidden until you publish it."
        }
        actions={
          <Button variant="ghost" href="/admin/social">
            Back to social links
          </Button>
        }
      />
      <div className="mt-8">
        <SocialLinkForm
          linkId={link.id}
          initial={siteSocialLinkFormStateFromDto(link)}
        />
      </div>
    </div>
  );
}