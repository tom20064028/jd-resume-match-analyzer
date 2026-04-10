'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage() {
    type FinalResult = {
        overall_score: number;
        summary: string;
        strengths: string[];
        weaknesses: Weakness[],
        improvement_plan: string[];
    };

    type Weakness = {
        topic: string,
        description: string
    }

    const router = useRouter();
    const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
    const [history, setHistory] = useState<FinalResult[]>([]);

    const scores = history.map(h => h.overall_score)
    const avg = scores.reduce((a,b) => a+b, 0) / scores.length
    const best = Math.max(...scores)
    const total = scores.length

    const weakMap: Record<string, number> = {}

    history.forEach(report => {
        report.weaknesses.forEach(w => {
            weakMap[w.topic] = (weakMap[w.topic] || 0) + 1
        })
    })

    console.log(weakMap)

    useEffect(() => {
        const historyStorage = localStorage.getItem("history");
        // const raw = localStorage.getItem("lastReport");
        if (!historyStorage) return;

        try {
            const parsed = JSON.parse(historyStorage) as FinalResult[];

            // This is client-only state initialization from `localStorage`.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFinalResult(parsed[parsed.length - 1]);
            setHistory(parsed);
        } catch (err) {
            console.error("Failed to parse lastReport from localStorage:", err);
        }
    }, []);

    const restartInterview = () => {
        localStorage.removeItem("currentInterviewSession")
        router.push("/interview-copilot");
    };

    const restartInterviewWithFocus = () => {
        localStorage.removeItem("currentInterviewSession")
        if (!finalResult) router.push("/interview-copilot");
        const result = finalResult as FinalResult;
        router.push(
            `/interview-copilot?focus=${encodeURIComponent(
              JSON.stringify(result.weaknesses.map((item) => {return item.topic}))
            )}`
        )
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start relative">
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">AI Interview Copilot</h1>
                        <p className="text-lg text-gray-500">
                            Pratise your interview.
                        </p>
                    </div>
                    {!!finalResult ? (
                        <div>
                            <h2 className="text-2xl font-bold">Interview End!</h2> 
                            <h3 className="text-lg font-semibold underline mt-8">Your Result:</h3>
                            { !!finalResult?.overall_score && 
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Score</h3>
                                    <p>{finalResult?.overall_score}</p>
                                </div>
                            }
                            { !!finalResult?.summary && 
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Summary</h3>
                                    <p>{finalResult?.summary}</p>
                                </div>
                            }
                            {finalResult.strengths.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold mt-4">Strengths</h3>
                                    <ul>
                                        {finalResult.strengths.map((s: string, i: number) => (
                                        <li className="list-disc list-inside" key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {finalResult.weaknesses.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold mt-4">Weaknesses</h3>
                                    <ul>
                                        {finalResult.weaknesses.map((s: Weakness, i: number) => (
                                            <li className="list-disc list-inside" key={i}>{s.topic} – {s.description}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {finalResult.improvement_plan.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold mt-4">Next steps:</h3>
                                    <ol>
                                        {finalResult.improvement_plan.map((s: string, i: number) => (
                                        <li className="list-decimal list-inside" key={i}>{s}</li>
                                        ))}
                                    </ol>
                                </>
                            )}
                            {history.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold underline mt-4">Progress Summary</h3>
                                    <p>Previous Score:</p>
                                    <div className="flex">
                                        {history.map((item, key) => (
                                            <div key={key}>&nbsp;{item.overall_score} { key !== history.length - 1 && "→"} </div>
                                        ))}
                                    </div>
                                    <br />
                                    <p>Average Score: {avg}</p>
                                    <p>Best Score: {best}</p>
                                    <p>Total Interviews: {total}</p>
                                    {/* <p>Most Frequent Weak Area: {}</p> */}
                                </>
                            )}
                            <div className="flex flex-col">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8" type="button" onClick={restartInterview}>
                                    Try Another Interview
                                </button>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8" type="button" onClick={restartInterviewWithFocus}>
                                    Practice Again (Focus on Weak Areas)
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold">No existing result</h2> 
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8" type="button" onClick={restartInterview}>
                                Go interview
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
  }
