"use client";

import { useState, useCallback } from "react";
import type { ActionItem, FilterStatus, SortKey } from "@/lib/types";
import TranscriptForm from "./components/TranscriptForm";
import ActionItemList from "./components/ActionItemList";
import ProgressCharts from "./components/ProgressCharts";

export default function DashboardPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");

  const handleSubmitTranscript = useCallback(async (transcript: string) => {
    const res = await fetch("/api/action-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.fallback?.length) {
        setItems((prev) => [...prev, ...data.fallback]);
        return;
      }
      throw new Error(data.error || "Request failed");
    }
    setItems((prev) => [...prev, ...(data.actionItems ?? [])]);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: i.status === "completed" ? "pending" : "completed" } : i
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            InsightBoard AI
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Submit meeting transcripts and track AI-generated action items
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="mb-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Submit transcript
          </h2>
          <TranscriptForm onSubmit={handleSubmitTranscript} />
        </section>
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Progress
          </h2>
          <ProgressCharts items={items} />
        </section>
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            Action items
          </h2>
          <ActionItemList
            items={items}
            onToggle={handleToggle}
            onDelete={handleDelete}
            filterStatus={filterStatus}
            sortKey={sortKey}
            onFilterChange={setFilterStatus}
            onSortChange={setSortKey}
          />
        </section>
      </main>
    </div>
  );
}
