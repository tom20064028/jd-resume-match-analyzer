'use client';

import { useState, type SyntheticEvent } from "react";
import { useRouter } from 'next/navigation'


type Evaluation = {
    score: number,
    correctness: string,
    bugs: string[],
    improvements: string[],

    followup: string

    strengths: string[],
    weaknesses: string[],
    improvement_plan: string[],
}

type SecondEvaluation = {
    score: number,
    strengths: string[],
    weaknesses: string[],
    improvement_plan: string[],

    improvement: string,
    remaining_issues: string[]
}

type Stage = "initial" | "followup" | "finished"

export default function CodingInterviewPage() {

    const router = useRouter()

    const [problem, setProblem] = useState("")
    const [solution, setSolution] = useState("")

    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

    const [secondEvaluation, setSecondEvaluation] = useState<SecondEvaluation | null>(null);

    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState<Stage>("initial")

    const submitForm = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const problemEntry = formData.get("problem");
            const solutionEntry = formData.get("solution");
            const followupanswerEntry = formData.get("followupanswer");
            const problem = typeof problemEntry === "string" ? problemEntry : "";
            const solution = typeof solutionEntry === "string" ? solutionEntry : "";
            const followupanswer = typeof followupanswerEntry === "string" ? followupanswerEntry : "";
            console.log(stage)
            const res = await fetch("/api/code-evaluate", {
                method: "POST",
                // `route.ts` expects: mode, problem, solution, feedback, followup_answer
                body: JSON.stringify({
                    mode: stage,
                    problem,
                    solution,
                    feedback: JSON.stringify({
                        weaknesses: evaluation?.weaknesses ?? [],
                        improvement_plan: evaluation?.improvement_plan ?? [],
                        bugs: evaluation?.bugs ?? [],
                    }),
                    followup_answer: followupanswer,
                }),
            })
            if (stage === "initial") {
                try {
                    const parsed = await res.json()
                    console.log(JSON.parse(parsed.raw) as Evaluation)
                    setEvaluation(JSON.parse(parsed.raw) as Evaluation);
                } catch {
                    setEvaluation({
                        score: 0,
                        correctness: "",
                        bugs: [],
                        improvements: [],
                        followup: "",
                        strengths: [],
                        weaknesses: [],
                        improvement_plan: [],
                    });
                }
            } else {
                try {
                    const parsed = await res.json()
                    setSecondEvaluation(JSON.parse(parsed.raw) as SecondEvaluation);
                } catch {
                    setSecondEvaluation({
                        score: 0,
                        strengths: [],
                        weaknesses: [],
                        improvement_plan: [],
                    
                        improvement: "",
                        remaining_issues: []
                    });
                }
            }
            
        } finally {
            setLoading(false);
            if (stage === "initial") {
                console.log("test")
                setStage("followup")
            } else {
                setStage("finished")
            }
        }
    }

    const fillExample = () => {
        setProblem("Reverse a linked list.")
        setSolution("def reverse(head):\nprev = None\ncurrent = head\nwhile current:\ncurrent.next = prev\ncurrent = current.next\nreturn prev")
    }

    return (

        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">Coding Interview</h1>
                    </div>
                    
                    <form onSubmit={(e) => submitForm(e)}>
                        { stage === "initial" && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="problem">Coding Problem</label>
                                    <textarea
                                        name="problem" id="problem" value={problem} onChange={(e) => setProblem(e.target.value)}
                                        placeholder="Paste Coding Problem" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="solution">Candidate Solution</label>
                                    <textarea
                                        name="solution" id="solution" value={solution} onChange={(e) => setSolution(e.target.value)}
                                        placeholder="Paste your Solution" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                                    />
                                </div>
                                <div className="grid w-full grid-cols-2 gap-4">
                                    <button type="submit" disabled={loading} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Evaluate Solution"}</button> 
                                    <button type="button" onClick={fillExample} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Use example"}</button> 
                                </div>
                            </div>
                        )}
                        { stage === "followup" && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2 mt-4">
                                    <h2 className="text-2xl font-bold">Result</h2> 
                                    {evaluation && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold">Match Score</h3>
                                            <p>{evaluation.score}</p>
                                            {evaluation.strengths?.length > 0 && (
                                                <>
                                                    <h3 className="text-lg font-semibold mt-4">Strengths</h3>
                                                    <ul>
                                                        {evaluation.strengths?.map((q, i) => (
                                                            <li className="list-disc list-inside" key={i}>{q}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {evaluation.weaknesses?.length > 0 && (
                                                <>
                                                    <h3 className="text-lg font-semibold mt-4">What you need to improve</h3>
                                                    <ul>
                                                        {evaluation.weaknesses?.map((q, i) => (
                                                            <li className="list-disc list-inside" key={i}>{q}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {evaluation.improvement_plan?.length > 0 && (
                                                <>
                                                    <h3 className="text-lg font-semibold mt-4">Next Steps</h3>
                                                    <ul>
                                                        {evaluation.improvement_plan?.map((q, i) => (
                                                            <li className="list-disc list-inside" key={i}>{q}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {/* {evaluation.bugs?.length > 0 && (
                                                <>
                                                    <h3 className="text-lg font-semibold mt-4">Evaluation bugs</h3>
                                                    <ul>
                                                        {evaluation.bugs?.map((q, i) => (
                                                            <li className="list-disc list-inside" key={i}>{q}</li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )} */}
                                            <h3 className="text-lg font-semibold mt-4">Follow-up Question</h3>
                                            <p>{evaluation.followup}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="followupanswer">Your Follow-up Answer</label>
                                    <textarea
                                        name="followupanswer" id="followupanswer" 
                                        placeholder="Your Follow-up Answer" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                                    />
                                </div>
                                <div className="grid w-full">
                                    <button type="submit" disabled={loading} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Submit Follow-up"}</button>
                                </div>
                            </div>
                        )}
                    </form>

                    { stage === "finished" && (
                        <div className="flex flex-col gap-2 mt-4">
                            <h2 className="text-2xl font-bold">Updated Evaluation</h2> 
                            {secondEvaluation && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Match Score</h3>
                                    <p>{secondEvaluation.score}</p>

                                    <h3 className="text-lg font-semibold mt-4">Improvement</h3>
                                    <p>{secondEvaluation.improvement}</p>

                                    {secondEvaluation.remaining_issues?.length > 0 && (
                                        <>
                                            <h3 className="text-lg font-semibold mt-4">Remaining Issues</h3>
                                            <ul>
                                                {secondEvaluation.remaining_issues?.map((q, i) => (
                                                    <li className="list-disc list-inside" key={i}>{q}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    
                                </div>
                            )}
                            <div className="grid w-full">
                                <button type="button" onClick={() => {
                                    router.push("/coding-interview")
                                }} disabled={loading} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Try again"}</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
  }