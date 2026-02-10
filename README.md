# InsightBoard AI — Dashboard

Productivity dashboard: submit meeting transcripts, get AI-generated action items, and track progress.

## Level completed

- **Level 1** (required): Transcript form, AI action-item generation, task list (complete/delete), pie chart, modern UI.
- **Level 2** (bonus): Filter by status, sort by date/priority/status, AI priority (High/Medium/Low), bar chart by priority.

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Recharts.
- **Backend:** Next.js API route (`/api/action-items`) with optional OpenAI integration.
- **LLM:** OpenAI (gpt-4o-mini). Set `OPENAI_API_KEY` in `.env.local` for AI extraction; otherwise fallback extraction is used.

## Local setup

1. Clone and install:

   ```bash
   npm install
   ```

2. (Optional) Add `.env.local` with your OpenAI key:

   ```
   OPENAI_API_KEY=sk-...
   ```

   See `.env.example`. Without it, the app still runs and returns fallback action items.

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Hosted deployment

- Deploy to **Vercel** (recommended): connect the repo and set `OPENAI_API_KEY` in project environment variables.
- The app is static-friendly; the only server logic is the `/api/action-items` route.

## Repository and live app

- **GitHub:** (add your repo link)
- **Live app:** (add your Vercel/hosted URL after deployment)

## Project structure

- `app/page.tsx` — Dashboard (client state, form submit, list + charts).
- `app/components/` — `TranscriptForm`, `ActionItemList`, `ProgressCharts`.
- `app/api/action-items/route.ts` — POST handler: accepts `{ transcript }`, returns `{ actionItems }` (or fallback if no API key).
- `lib/types.ts` — Shared types (`ActionItem`, `Priority`, filter/sort types).
