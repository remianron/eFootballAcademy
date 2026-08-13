import type { Metadata } from "next";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminTable,
  type AdminColumn,
} from "@/components/admin";
import { Badge, Button, Card } from "@/components";
import { ContentStatusBadge } from "@/components/admin/content-editor";
import { IconEdit, IconEye } from "@/components/icons";
import {
  listTutorialsOverview,
  type TutorialOverviewRow,
} from "@/lib/db/repositories/tutorials.repo";
import { formatDate } from "@/lib/labels";
import {
  DIFFICULTY_LABELS,
  TUTORIAL_CATEGORY_LABELS,
} from "@/lib/content-editor/labels";

export const metadata: Metadata = {
  title: "Tutorials",
};

export const dynamic = "force-dynamic";

const columns: AdminColumn<TutorialOverviewRow>[] = [
  {
    header: "Title",
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
      <Badge variant="neutral">{TUTORIAL_CATEGORY_LABELS[tutorial.category]}</Badge>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Difficulty",
    render: (tutorial) => (
      <span className="text-secondary">{DIFFICULTY_LABELS[tutorial.difficulty]}</span>
    ),
    className: "whitespace-nowrap",
  },
  {
    header: "Status",
    render: (tutorial) => <ContentStatusBadge status={tutorial.status} />,
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
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/tutorials/${tutorial.slug}`}
        >
          <IconEye className="h-3.5 w-3.5" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          href={`/admin/tutorials/${tutorial.id}/edit`}
        >
          <IconEdit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
    ),
    className: "whitespace-nowrap",
    headerClassName: "text-right",
  },
];

export default async function AdminTutorialsPage() {
  const tutorials = await listTutorialsOverview();

  return (
    <>
      <AdminPageHeader
        eyebrow="Tutorials"
        title="Tutorial management"
        description="Tutorials are structured step-by-step guides. Drafts stay hidden until you publish them."
        actions={<Button href="/admin/tutorials/new">New tutorial</Button>}
      />

      <div className="mt-6">
        {tutorials.length === 0 ? (
          <AdminEmptyState
            title="No tutorials yet"
            description="Create the first tutorial — it will appear here as a draft."
            action={<Button href="/admin/tutorials/new">New tutorial</Button>}
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
    </>
  );
}