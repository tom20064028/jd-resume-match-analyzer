import OpenAI from "openai";

export const runtime = "nodejs"; // 保守啲：用 Node runtime

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
    "X-Title": process.env.OPENROUTER_APP_NAME || "JD-Resume Analyzer",
  },
});

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini", // 例子：你可換其他 OpenRouter model
      messages: [
        { role: "system", content: 'Based on the interview history:\n\n1. Give an overall score (1–10)\n2. Identify 2–3 key strengths\n3. Identify 2–3 critical weaknesses\n4. Provide a clear improvement plan\n\nAlso include a short overall summary (1 sentence) describing the candidate\'s level and main improvement area.\n\nImportant:\n- Be specific and actionable\n- Avoid generic advice\n- Focus on real interview performance\n- Keep it concise but insightful\n\nFor weaknesses:\n- A short topic (2-4 words)\n- A short explanation\n\nImprovement plan should:\n- Include concrete actions\n- Be practical (what to do next)\n- Be achievable within 1–2 weeks\n\ntype weakness : {\n"topic": string,\n"description": string\n}\n\nReturn ONLY JSON:\n{\n  "overall_score": number,\n"summary": string,\n  "strengths": string[],\n"weaknesses": Weakness[],\n  "improvement_plan": string[]\n}' },
        {
          role: "user",
          content:
            `Interview history:\n\n${JSON.stringify(history)}`
        },
      ],
      temperature: 0.2,
    });

    const text = completion.choices?.[0]?.message?.content ?? "{}";
    return Response.json({ raw: text });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}