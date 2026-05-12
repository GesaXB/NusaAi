import { NextRequest } from "next/server";
import { SYSTEM_PROMPT } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { messages, modelId, systemPrompt } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("[Chat API] Missing OPENROUTER_API_KEY");
      return new Response(JSON.stringify({ error: "API key not configured" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "NusaAI",
      },
      body: JSON.stringify({
        model: modelId ?? "deepseek/deepseek-chat",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt ?? SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 1000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[Chat API] OpenRouter error:", errorData);
      return new Response(JSON.stringify({ error: `OpenRouter error: ${errorData}` }), { 
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("[Chat API] Internal error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
