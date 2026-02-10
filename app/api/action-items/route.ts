import { NextRequest, NextResponse } from "next/server";

export type Priority = "High" | "Medium" | "Low";

export interface ActionItemResponse {
  id: string;
  text: string;
  status: "pending";
  priority: Priority;
  createdAt: string;
}

const systemPrompt = `You are an assistant that extracts action items from meeting transcripts.
Return a JSON array of objects. Each object must have: "text" (string), "priority" (one of "High", "Medium", "Low").
Do not include id or createdAt - the backend will add those.
Be concise. Extract only clear, actionable tasks.`;

export async function POST(request: NextRequest) {
  try {
    const { transcript } = (await request.json()) as { transcript: string };
    if (!transcript?.trim()) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not set. Add it to .env.local for AI extraction.",
          fallback: getFallbackActionItems(transcript),
        },
        { status: 503 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Extract action items from this transcript:\n\n${transcript.slice(0, 12000)}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        {
          error: "LLM request failed",
          details: err,
          fallback: getFallbackActionItems(transcript),
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty LLM response", fallback: getFallbackActionItems(transcript) },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content) as { actionItems?: Array<{ text: string; priority?: string }> };
    const raw = Array.isArray(parsed.actionItems) ? parsed.actionItems : Array.isArray(parsed) ? parsed : [];
    const now = new Date().toISOString();
    const items: ActionItemResponse[] = raw.slice(0, 20).map((item, i) => ({
      id: `ai-${now}-${i}`,
      text: typeof item.text === "string" ? item.text : String(item),
      status: "pending" as const,
      priority: ["High", "Medium", "Low"].includes(item.priority) ? item.priority : "Medium",
      createdAt: now,
    }));

    return NextResponse.json({ actionItems: items });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

function getFallbackActionItems(transcript: string): ActionItemResponse[] {
  const lines = transcript
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
  const now = new Date().toISOString();
  return lines.slice(0, 5).map((text, i) => ({
    id: `fallback-${now}-${i}`,
    text,
    status: "pending" as const,
    priority: "Medium" as Priority,
    createdAt: now,
  }));
}
