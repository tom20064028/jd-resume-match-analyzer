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
    const { jd, resume } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini", // 例子：你可換其他 OpenRouter model
      messages: [
        { role: "system", content: 'You are a technical interviewer.\n\nReturn ONLY valid JSON in this exact structure:\n\n{"questions": string[]}\n\nDo not add any explanation or extra keys.' },
        {
          role: "user",
          content:
            `Given this job description, generate 5 realistic interview questions a candidate might be asked.\n` +
            `Return ONLY JSON:\n` +
            `{"questions": string[]}`
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