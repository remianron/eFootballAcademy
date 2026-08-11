import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  IconEdit,
  IconEye,
  IconPlus,
  IconSliders,
  IconTrash,
} from "@/components/icons";

interface Capability {
  label: string;
  icon: ReactNode;
  available: boolean;
}

const capabilities: Capability[] = [
  { label: "Create", icon: <IconPlus className="h-4 w-4" />, available: false },
  { label: "Read", icon: <IconEye className="h-4 w-4" />, available: true },
  { label: "Update", icon: <IconEdit className="h-4 w-4" />, available: false },
  {
    label: "Publish / Unpublish",
    icon: <IconSliders className="h-4 w-4" />,
    available: false,
  },
  {
    label: "Delete",
    icon: <IconTrash className="h-4 w-4" />,
    available: false,
  },
];

/**
 * Roadmap strip showing the CRUD operations each content section will
 * support. This is the UI structure the operations will plug into in a
 * later phase.
 */
export function AdminCapabilities({
  noun,
  className,
}: {
  noun: string;
  className?: string;
}) {
  return (
    <Card className={cn("mt-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-display-md font-semibold text-foreground">
          Planned operations
        </h2>
        <Badge variant="gold">Roadmap</Badge>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        The UI below is the structure the future admin will use to create,
        edit, publish and delete {noun}. Everything except viewing is planned
        for a later phase.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.map(({ label, icon, available }) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-2.5 rounded-control border px-3 py-2.5",
              available
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card-secondary/40"
            )}
          >
            <span
              className={cn(
                "shrink-0",
                available ? "text-electric" : "text-muted"
              )}
            >
              {icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-secondary">
                {label}
              </span>
              <span className="block text-[0.6875rem] text-muted">
                {available ? "Available now" : "Planned"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
