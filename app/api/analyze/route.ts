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
    // return Response.json({ raw: '{\n  \"score\": 75,\n  \"missing_skills\": [\n    \"Dockerisation\",\n    \"Machine Learning\",\n    \"GitLab CI/CD\",\n    \"Déploiement dockerisé sur un orchestrateur\",\n    \"API Rest (specific mention in JD)\",\n    \"Conception technico/fonctionnelle\",\n    \"Mise en œuvre de POC\",\n    \"Élaboration de stratégie de développement\",\n    \"Documentation technique automatisée\"\n  ],\n  \"rewrite_suggestions\": [\n    \"Highlight experience with Docker and containerization technologies.\",\n    \"Include any experience with machine learning or related technologies.\",\n    \"Mention familiarity with GitLab CI/CD for continuous integration and deployment.\",\n    \"Detail any experience with orchestrators for Docker deployments.\",\n    \"Clarify experience with API Rest, specifically in the context of the job description.\",\n    \"Add examples of participation in technical and functional design.\",\n    \"Include any experience with proof of concept (POC) implementations.\",\n    \"Discuss any strategies developed for software development.\",\n    \"Mention experience in writing technical documentation.\"\n  ]\n}' });
    const { jd, resume } = await req.json();

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini", // 例子：你可換其他 OpenRouter model
      messages: [
        { role: "system", content: 'You are a resume analysis engine.\n\nReturn ONLY valid JSON in this exact structure:\n\n{"score": number,"missing_skills": string[],"rewrite_suggestions": string[]}\n\nDo not add any explanation or extra keys.' },
        {
          role: "user",
          content:
            `Analyze resume vs JD and return JSON:\n` +
            `{"score":number,"missing_skills":string[],"rewrite_suggestions":string[]}\n\n` +
            `JD:\n${jd}\n\nResume:\n${resume} \n\n` +
            `If unsure, still return the structure with empty arrays.`,
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