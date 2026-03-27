'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage() {
    type FinalResult = {
        overall_score: number;
        strengths: string[];
        weaknesses: string[];
        improvement_plan: string[];
    };

    const router = useRouter();
    const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("lastReport");
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw) as FinalResult;
            // This is client-only state initialization from `localStorage`.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFinalResult(parsed);
        } catch (err) {
            console.error("Failed to parse lastReport from localStorage:", err);
        }
    }, []);

    const restartInterview = () => {
        router.push("/interview-copilot");
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
                    {!!finalResult && (
                        <div>
                            <h2 className="text-2xl font-bold">Interview End!</h2> 
                            <h3 className="text-lg font-semibold underline mt-8">Your Result:</h3>
                            { !!finalResult?.overall_score && 
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Score</h3>
                                    <p>{finalResult?.overall_score}</p>
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
                                    {finalResult.weaknesses.map((s: string, i: number) => (
                                    <li className="list-disc list-inside" key={i}>{s}</li>
                                    ))}
                                </ul>
                                </>
                            )}
                            {finalResult.improvement_plan.length > 0 && (
                                <>
                                <h3 className="text-lg font-semibold mt-4">Improvement Plan</h3>
                                <ul>
                                    {finalResult.improvement_plan.map((s: string, i: number) => (
                                    <li className="list-disc list-inside" key={i}>{s}</li>
                                    ))}
                                </ul>
                                </>
                            )}
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8" type="button" onClick={restartInterview}>
                                Back
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
  }