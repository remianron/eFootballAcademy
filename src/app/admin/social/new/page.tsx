import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components";
import { SocialLinkForm } from "@/components/admin/social-editor/social-link-form";

export const metadata: Metadata = {
  title: "New social link",
};

export const dynamic = "force-dynamic";

export default function NewSocialLinkPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        eyebrow="Social Links"
        title="New social link"
        description="Add a global social link. It will not appear on the public site until you enter a real URL and publish it."
        actions={
          <Button variant="ghost" href="/admin/social">
            Back to social links
          </Button>
        }
      />
      <div className="mt-8">
        <SocialLinkForm />
      </div>
    </div>
  );
}