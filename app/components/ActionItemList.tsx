"use client";

import type { ActionItem, FilterStatus, SortKey } from "@/lib/types";

interface ActionItemListProps {
  items: ActionItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filterStatus: FilterStatus;
  sortKey: SortKey;
  onFilterChange: (v: FilterStatus) => void;
  onSortChange: (v: SortKey) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Low: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
};

export default function ActionItemList({
  items,
  onToggle,
  onDelete,
  filterStatus,
  sortKey,
  onFilterChange,
  onSortChange,
}: ActionItemListProps) {
  const filtered =
    filterStatus === "all"
      ? items
      : items.filter((i) => i.status === filterStatus);

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "createdAt") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortKey === "priority") {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    }
    return a.status.localeCompare(b.status);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Filter:</span>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as FilterStatus)}
          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Sort:</span>
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="createdAt">Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>
      <ul className="flex flex-col gap-2">
        {sorted.length === 0 ? (
          <li className="rounded-lg border border-dashed border-zinc-300 py-8 text-center text-sm text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
            No action items. Submit a transcript to generate tasks.
          </li>
        ) : (
          sorted.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-zinc-400 text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-500"
                aria-label={item.status === "completed" ? "Mark pending" : "Mark complete"}
              >
                {item.status === "completed" ? "✓" : ""}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={
                    item.status === "completed"
                      ? "text-zinc-500 line-through dark:text-zinc-400"
                      : "text-zinc-900 dark:text-zinc-100"
                  }
                >
                  {item.text}
                </p>
                <span
                  className={`mt-1 inline-block rounded px-1.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[item.priority] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"}`}
                >
                  {item.priority}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                aria-label="Delete"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
