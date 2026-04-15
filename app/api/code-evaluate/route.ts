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
    const { mode, problem, solution, feedback, followup_answer } = await req.json();
    let prompt = {
        server: "",
        client: ""
    }

    if (mode === "initial") {
        prompt = {
            server: 'You are a senior software engineer conducting a coding interview.\n\nBe strict in scoring.\n\nA score of 10 should only be given if:\n- The solution is correct\n- Edge cases are clearly handled\n- The explanation is thorough\n- The candidate demonstrates deep understanding\n\nMost answers should fall between 6-8.\n\nGiven:\n- Coding problem\n- Candidate solution\n\nEvaluate the solution.\n\nReturn ONLY JSON:\n\n{\n"score": number (0-10),\n  "strengths": string[],\n  "weaknesses": string[],\n  "improvement_plan": string[],\n"correctness": string,\n"bugs": string[],\n"improvements": string[],\n"followup": string\n}\n\nThe follow-up question should:\n- Be specific to the candidate\'s solution\n- Focus on weaknesses or missing aspects\n- Avoid generic questions like asking only for time/space complexity\n- Ask probing questions that test deeper understanding\n\nAlso provide:\n\n- strengths: what the candidate did well\n- weaknesses: key issues in the solution\n- improvement_plan: specific steps to improve\n\nKeep them concise and actionable.',
            client: `Coding problem:\n${problem}\n\nCandidate solution:\n${solution}`
        }
    } else {
        prompt = {
            server: 'You are continuing a coding interview.\n\nGiven:\n- Original problem\n- Candidate solution\n- Previous feedback\n- Candidate follow-up answer\n\nEvaluate improvement and give updated feedback.\n\nReturn JSON:\n{\n"score": number,\n  "strengths": string[],\n  "weaknesses": string[],\n  "improvement_plan": string[],\n"improvement": string,\n"remaining_issues": string[]\n}\n\nAlso update:\n\n- strengths\n- weaknesses\n- improvement_plan\n\nbased on the candidate’s follow-up answer.',
            client: `Original problem:\n${problem}\n\nCandidate solution:\n${solution}\n\nPrevious feedback:\n${feedback}\n\nCandidate follow-up answer:\n${followup_answer}`
        }
    }
    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini", // 例子：你可換其他 OpenRouter model
      messages: [
        { role: "system", content: prompt.server },
        { role: "user", content: prompt.client },
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