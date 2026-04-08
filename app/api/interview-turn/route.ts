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
    const { question, answer, history, focusAreas, currentFocus, difficulty } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini", // 例子：你可換其他 OpenRouter model
      messages: [
        { role: "system", content: `You are a senior technical interviewer conducting a dynamic interview.\n\nFocus areas for this interview:\n${focusAreas.join(", ")}\n\nThe current focus area is:\n${currentFocus}\n\nInstructions:\n- Evaluate the candidate's answer\n- Provide concise feedback\n- Ask a follow-up question related to the current focus area\n- Usually stay within the same focus area\n- Only move to another focus area if the candidate shows strong understanding or the topic is sufficiently explored\n- Avoid repeating previous questions\n- Adjust difficulty based on candidate performance\n\nAdjust question difficulty based on this level:\n${difficulty}\n\n- easy: ask fundamental or basic questions\n- medium: ask standard interview-level questions\n- hard: ask deeper, edge cases, or system-level questions\n\nReturn ONLY JSON:\n\n{\n  "score": number,\n  "feedback": string,\n  "next_question": string,\n  "next_focus": string\n}\n\n"next_focus" must be one of the focus areas.` },
        {
          role: "user",
          content:
            `Focus Areas:\n${focusAreas.join(", ")}\n\nInterview History:\n${history}\n\nCurrent Question:\n${question}\n\nCandidate Answer:\n${answer}`
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