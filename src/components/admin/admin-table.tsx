import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface AdminColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

type AdminTableProps<T> = {
  columns: AdminColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
};

/**
 * Generic data table for admin lists. Horizontal scrolling keeps it
 * usable on small screens.
 */
export function AdminTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "No content yet.",
  className,
}: AdminTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={cn(
                  "px-4 py-3 text-[0.6875rem] font-semibold tracking-widest text-muted uppercase",
                  column.headerClassName
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-border/60 transition-colors duration-150 last:border-b-0 hover:bg-card-secondary/40"
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={cn("px-4 py-3 text-sm", column.className)}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
