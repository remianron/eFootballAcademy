import type { Metadata } from "next";
import {
  AdminCapabilities,
  AdminEmptyState,
  AdminPageHeader,
  AdminRowActions,
  AdminStatusBadge,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { getAdminTutorials } from "@/lib/admin";
import {
  DIFFICULTY_LABELS,
  formatDate,
  TUTORIAL_CATEGORY_LABELS,
} from "@/lib/labels";
import type { Tutorial } from "@/content/types";

export const metadata: Metadata = {
  title: "Tutorials",
};

const columns: AdminColumn<Tutorial>[] = [
  {
    header: "Tutorial",
    render: (tutorial) => (
      <div>
        <p className="font-medium text-foreground">{tutorial.title}</p>
        <p className="mt-0.5 text-xs text-muted">{tutorial.slug}</p>
      </div>
    ),
  },
  {
    header: "Category",
    render: (tutorial) => (
      <Badge variant="neutral">
        {TUTORIAL_CATEGORY_LABELS[tutorial.category]}
      </Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Difficulty",
    render: (tutorial) => (
      <span className="text-secondary">
        {DIFFICULTY_LABELS[tutorial.difficulty]}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (tutorial) => (
      <AdminStatusBadge status={tutorial.publishedStatus} />
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Updated",
    render: (tutorial) => (
      <span className="text-xs text-muted tabular-nums">
        {formatDate(tutorial.updatedAt)}
      </span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Actions",
    render: (tutorial) => (
      <AdminRowActions
        viewHref={`/tutorials/${tutorial.slug}`}
        status={tutorial.publishedStatus}
      />
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminTutorialsPage() {
  const tutorials = await getAdminTutorials();

  return (
    <>
      <AdminPageHeader
        eyebrow="Tutorials"
        title="Tutorial management"
        description="Training tutorials published by the Academy. Editing, publishing and deleting become available in a later phase."
        actions={<Button disabled>New tutorial</Button>}
      />

      <div className="mt-6">
        {tutorials.length === 0 ? (
          <AdminEmptyState
            title="No tutorials yet"
            description="Tutorials created here will appear in this list."
          />
        ) : (
          <Card padded={false}>
            <AdminTable
              columns={columns}
              rows={tutorials}
              getRowKey={(tutorial) => tutorial.id}
            />
          </Card>
        )}
      </div>

      <AdminCapabilities noun="tutorials" />
    </>
  );
}
