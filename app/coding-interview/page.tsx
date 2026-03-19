'use client';

import { useEffect, useState } from "react";


type Evaluation = {
    score: number,
    bugs: string[],
    followup: string
}

export default function CodingInterviewPage() {

    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                const formData = new FormData(form);
                const problem = formData.get("problem");
                const solution = formData.get("solution");
                const res = await fetch("/api/code-evaluate", {
                    method: "POST",
                    body: JSON.stringify({ problem, solution }),
                })
                try {
                    const parsed = await res.json()
                    
                    // const parsed: Evaluation = {
                    //     score: 7,
                    //     bugs: ["edge case not handled"],
                    //     followup: "How to optimize?"
                    // }
                    console.log(JSON.parse(parsed.raw) as Evaluation)
                    setEvaluation(JSON.parse(parsed.raw) as Evaluation);
                } catch {
                    setEvaluation({
                        score: 0,
                        bugs: [],
                        followup: ""
                    });
                }
            } finally {
                setLoading(false);
            }
        });
    }, []);

    return (

        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <a href="/" className="absolute top-12">
                    ← Back to Toolkit
                </a>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">Coding Interview</h1>
                    </div>
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="problem">Coding Problem</label>
                            <textarea
                                name="problem" id="problem" 
                                placeholder="Paste Coding Problem" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="solution">Candidate Solution</label>
                            <textarea
                                name="solution" id="solution"
                                placeholder="Paste your Solution" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                            />
                        </div>
                        <div className="grid w-full">
                            <button type="submit" disabled={loading} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Evaluate Code"}</button>
                        </div>
                    </form>
                    {evaluation && (
                        <div className="flex flex-col gap-2 mt-4">
                            <h2 className="text-2xl font-bold">Result</h2> 
                            {evaluation && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Match Score</h3>
                                    <p>{evaluation.score}</p>
                                    {evaluation.bugs?.length > 0 && (
                                        <>
                                            <h3 className="text-lg font-semibold mt-4">Evaluation bugs</h3>
                                            <ul>
                                                {evaluation.bugs?.map((q, i) => (
                                                    <li className="list-disc list-inside" key={i}>{q}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    <h3 className="text-lg font-semibold mt-4">Follow-up</h3>
                                    <p>{evaluation.followup}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
  }