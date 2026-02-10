"use client";

import { useState } from "react";

interface TranscriptFormProps {
  onSubmit: (transcript: string) => Promise<void>;
  disabled?: boolean;
}

export default function TranscriptForm({ onSubmit, disabled }: TranscriptFormProps) {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = transcript.trim();
    if (!trimmed) {
      setError("Please enter a meeting transcript.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(trimmed);
      setTranscript("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract action items.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="transcript" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Meeting transcript
      </label>
      <textarea
        id="transcript"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste your meeting transcript here..."
        rows={6}
        disabled={disabled || loading}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 disabled:opacity-60"
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={disabled || loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-zinc-900"
      >
        {loading ? "Extracting…" : "Extract action items"}
      </button>
    </form>
  );
}
