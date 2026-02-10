"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { ActionItem } from "@/lib/types";

interface ProgressChartsProps {
  items: ActionItem[];
}

const PIE_COLORS = { completed: "#10b981", pending: "#64748b" };
const BAR_COLORS = { High: "#f43f5e", Medium: "#f59e0b", Low: "#0ea5e9" };

export default function ProgressCharts({ items }: ProgressChartsProps) {
  const completed = items.filter((i) => i.status === "completed").length;
  const pending = items.filter((i) => i.status === "pending").length;
  const pieData = [
    { name: "Completed", value: completed, fill: PIE_COLORS.completed },
    { name: "Pending", value: pending, fill: PIE_COLORS.pending },
  ];

  const priorityCounts = items.reduce(
    (acc, i) => {
      acc[i.priority] = (acc[i.priority] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const barData = ["High", "Medium", "Low"].map((p) => ({
    priority: p,
    count: priorityCounts[p] ?? 0,
    fill: BAR_COLORS[p as keyof typeof BAR_COLORS],
  }));

  const hasItems = items.length > 0;

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Progress
        </h3>
        {hasItems ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            No data yet
          </div>
        )}
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          By priority
        </h3>
        {hasItems ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            No data yet
          </div>
        )}
      </div>
    </div>
  );
}
