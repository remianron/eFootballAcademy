import type { Metadata } from "next";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { SocialRowActions } from "@/components/admin/social-editor/social-row-actions";
import { listAllSiteSocialLinks } from "@/lib/db/repositories/social-links.repo";
import type { SiteSocialLinkDto } from "@/lib/db/types";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Social Links",
};

export const dynamic = "force-dynamic";

const columns: AdminColumn<SiteSocialLinkDto>[] = [
  {
    header: "Platform",
    render: (link) => (
      <div>
        <p className="font-medium text-foreground">{link.label}</p>
        <p className="mt-0.5 text-xs text-muted">{link.platform}</p>
      </div>
    ),
  },
  {
    header: "URL",
    render: (link) => (
      <span
        title={link.url}
        className="block max-w-[16rem] truncate text-xs text-muted"
      >
        {link.url}
      </span>
    ),
  },
  {
    header: "Status",
    render: (link) =>
      link.published ? (
        <Badge variant="success">Published</Badge>
      ) : (
        <Badge variant="neutral">Unpublished</Badge>
      ),
    className: "whitespace-nowrap",
  },
  {
    header: "Order",
    render: (link) => (
      <span className="text-xs text-secondary tabular-nums">
        {link.sortOrder}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Updated",
    render: (link) => (
      <span className="text-xs text-muted tabular-nums">
        {formatDate(link.updatedAt.toISOString())}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (link) => <SocialRowActions link={link} />,
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminSocialLinksPage() {
  const links = await listAllSiteSocialLinks();

  return (
    <>
      <AdminPageHeader
        eyebrow="Social Links"
        title="Social links management"
        description="Global social links for the footer and the floating widget. Only published links appear on the public site."
        actions={<Button href="/admin/social/new">Add social link</Button>}
      />

      <div className="mt-6">
        {links.length === 0 ? (
          <AdminEmptyState
            title="No social links yet"
            description="Add your first social link. It stays hidden until you enter a real URL and publish it."
            action={<Button href="/admin/social/new">Add social link</Button>}
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={links}
              getRowKey={(link) => link.id}
            />
          </Card>
        )}
      </div>
    </>
  );
}