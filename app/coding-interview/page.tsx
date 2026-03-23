'use client';

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";


type Evaluation = {
    score: number,
    bugs: string[],
    followup: string
}

type SecondEvaluation = {
    score: number,
    improvement: string,
    remaining_issues: string[]
}

type Stage = "initial" | "followup"

export default function CodingInterviewPage() {

    const [problem, setProblem] = useState("")
    const [solution, setSolution] = useState("")

    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

    const [secondEvaluation, setSecondEvaluation] = useState<SecondEvaluation | null>(null);

    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState<Stage>("initial")

    const submitForm = async (e: HTMLFormElement) => {
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
            const res = await fetch("/api/code-evaluate", {
                method: "POST",
                // `route.ts` expects: mode, problem, solution, feedback, followup_answer
                body: JSON.stringify({
                    mode: stage,
                    problem,
                    solution,
                    feedback: evaluation?.followup ?? "",
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
                        bugs: [],
                        followup: ""
                    });
                }
            } else {
                try {
                    const parsed = await res.json()
                    setSecondEvaluation(JSON.parse(parsed.raw) as SecondEvaluation);
                } catch {
                    setSecondEvaluation({
                        score: 0,
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
                <Link href="/" className="absolute top-12">
                    ← Back to Toolkit
                </Link>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">Coding Interview</h1>
                    </div>
                    <form className="flex flex-col gap-4" onSubmit={(e) => submitForm(e)}>
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
                        { stage === "initial" && 
                            <div className="grid w-full grid-cols-2 gap-4">
                                <button type="submit" disabled={loading} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Ask Follow-up"}</button> 
                                <button type="button" onClick={fillExample} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Use example"}</button> 
                            </div>
                        }          
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
                        { stage === "followup" && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="followupanswer">Your Follow-up Answer</label>
                                    <textarea
                                        name="followupanswer" id="followupanswer" 
                                        placeholder="Your Follow-up Answer" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                                    />
                                </div>
                                <div className="grid w-full">
                                    <button type="submit" disabled={loading} className={`bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer`}>{"Evaluate Code"}</button>
                                </div>
                            </>
                        )}
                        
                    </form>
                    {secondEvaluation && (
                            <div className="flex flex-col gap-2 mt-4">
                                <h2 className="text-2xl font-bold">Result</h2> 
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
                            </div>
                        )}
                </div>
            </main>
        </div>
    );
  }