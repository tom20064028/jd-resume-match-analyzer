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
    const { question, answer, history, missing_skills } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini", // 例子：你可換其他 OpenRouter model
      messages: [
        { role: "system", content: `You are a senior technical interviewer.\n\nYou are conducting a dynamic interview.\n\nGoals:\n- Evaluate the candidate\'s answer\n- Identify strengths and weaknesses\n- Ask a relevant follow-up question\n- Focus more on the candidate\'s missing skills\n\nImportant:\n- Avoid repeating previous questions\n- Ask deeper or related follow-up questions\n- If the candidate is weak, simplify or probe fundamentals\n- If the candidate is strong, increase difficulty\n\nFocus on these missing skills:\n${missing_skills}\n\nReturn ONLY JSON:\n\n{\n"score": number,\n"feedback": string,\n"next_question": string\n}\n\nScore should be between 1 and 10.\n\nKeep feedback concise (max 2 sentences).` },
        {
          role: "user",
          content:
            `Interview History:\n${history}\n\nCurrent Question:\n${question}\n\nCandidate Answer:\n${answer}`
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