'use client';

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function QuestionsFromSearchParams({ onSetQuestions }: { onSetQuestions: (qs: string[]) => void }) {
    const searchParams = useSearchParams();
    const questionsParam = searchParams.get("questions");

    useEffect(() => {
        if (!questionsParam) {
            onSetQuestions([]);
            return;
        }

        try {
            const decoded = decodeURIComponent(questionsParam);
            const parsed = JSON.parse(decoded);
            onSetQuestions(Array.isArray(parsed) ? parsed : []);
        } catch {
            onSetQuestions([]);
        }
    }, [questionsParam, onSetQuestions]);

    return null;
}

export default function InterviewCopilotPage() {
    const router = useRouter()

    type HistoryItem = {
        question: string;
        answer: string;
        score: number;
        feedback: string;
    };

    type FinalResult = {
        overall_score: number,
        strengths: string[],
        weaknesses: string[],
        improvement_plan: string[]
    };

    const [jd, setJd] = useState("")
    const [resume, setResume] = useState("")

    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState(0)
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [score, setScore] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [showRaw, setShowRaw] = useState(false);
    const [questions, setQuestions] = useState<string[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [finish, setFinish] = useState(false)

    const [history, setHistory] = useState<HistoryItem[]>([])
    const [finalResult, setFinalResult] = useState<FinalResult | null>(null)

    useEffect(() => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData(form);
            const jd = formData.get("jd");
            const resume = formData.get("resume");
            fetch("/api/interview-copilot", {
                method: "POST",
                body: JSON.stringify({ jd, resume }),
            }).then(res => res.json()).then(data => {
                let parsed;

                try {
                parsed = JSON.parse(data.raw);
                } catch {
                parsed = {
                    match_score: 0,
                    missing_skills: [],
                    interview_questions: ["Invalid JSON from model"]
                };
                }
                setResult(parsed);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        });
    }, []);

    const hasNext = currentIndex < questions.length - 1

    const interviewStart = () => {
        const questionsParam = encodeURIComponent(JSON.stringify(result.interview_questions))
        router.push(`/interview-copilot?questions=${questionsParam}`)
    }

    const submitAnswer = () => {
        const interviewForm = document.querySelector("#interview-form");
        setLoading(true);
        const formData = new FormData(interviewForm as HTMLFormElement);
        const answer = formData.get("answer");
        fetch("/api/interview-turn", {
            method: "POST",
            body: JSON.stringify({ question: questions[currentIndex], answer, history }),
        }).then(res => res.json()).then(data => {
            let parsed;
    
            try {
                parsed = JSON.parse(data.raw);
            } catch {
                parsed = {
                    score: 0,
                    feedback: "",
                    next_question: ""
                };
            }
            setHistory(prev => [
                ...prev,
                {
                    question,
                    answer: String(answer ?? ""),
                    score: parsed.score,
                    feedback: parsed.feedback,
                }
            ])
            setScore(parsed.score)
            setFeedback(parsed.feedback)
            // setQuestion(parsed.next_question);
            if (hasNext) {
                setCurrentIndex(currentIndex + 1)
            } else {
                setFinish(true)
            }
            
            setLoading(false);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
            setAnswer("")

        }) 
    }

    const finishInterview = () => {

        fetch("/api/interview-finish-copilot", {
            method: "POST",
            body: JSON.stringify({ history }),
        }).then(res => res.json()).then(data => {
            let parsed;
    
            try {
                parsed = JSON.parse(data.raw);
                setFinalResult(parsed)
            } catch {
                parsed = {
                    "overall_score": 0,
                    "strengths": [],
                    "weaknesses": [],
                    "improvement_plan": []
                };
            }
            
            setLoading(false);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
            setStage(2)
        }) 
    }

    const resetInterviewState = () => {
        setJd("");
        setResume("");

        setResult(null);
        setLoading(false);
        setStage(0);

        setQuestion("");
        setAnswer("");
        setScore(0);
        setFeedback("");
        setShowRaw(false);

        setQuestions([]);
        setCurrentIndex(0);
        setFinish(false);

        setHistory([]);
        setFinalResult(null);
    }

    const restartInterview = () => {
        resetInterviewState();
        // Clear the `?questions=...` query so QuestionsFromSearchParams doesn't repopulate state.
        router.replace(`/interview-copilot`)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start relative">
                <Suspense fallback={null}>
                    <QuestionsFromSearchParams onSetQuestions={setQuestions} />
                </Suspense>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">AI Interview Copilot</h1>
                        <p className="text-lg text-gray-500">
                            Pratise your interview.
                        </p>
                    </div>
                    { questions.length === 0 && (
                        <form className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="jd">JD</label>
                                <textarea placeholder="Paste job description" name="jd" id="jd" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} required value={jd} onChange={(e) => setJd(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="resume">Resume</label>
                                <textarea name="resume" id="resume" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} required value={resume} onChange={(e) => setResume(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer col-span-2">Start</button>
                                {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" type="button" onClick={() => setJd(exampleJD)}>
                                    Use example
                                </button> */}
                            </div>
                    
                            {result && (
                                <div className="flex flex-col gap-2 mt-4">
                                    <h2 className="text-2xl font-bold">Result</h2>
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Match Score</h3>
                                        <p>{result.match_score}</p>
                                        {result.missing_skills?.length > 0 && (
                                        <>
                                            <h3 className="text-lg font-semibold mt-4">Missing skills</h3>
                                            <ul>
                                            {result.missing_skills?.map((s: string, i: number) => (
                                                <li className="list-disc list-inside" key={i}>{s}</li>
                                            ))}
                                            </ul>
                                        </>
                                        )}

                                        {result.interview_questions?.length > 0 && (
                                        <>
                                            <h3 className="text-lg font-semibold mt-4">Interview Questions</h3>
                                            <ul>
                                            {result.interview_questions?.map((s: string, i: number) => (
                                                <li className="list-disc list-inside" key={i}>{s}</li>
                                            ))}
                                            </ul>
                                        </>
                                        )}

                                        <button onClick={() => setShowRaw(!showRaw)} className="text-sm font-semibold mt-4 text-center text-gray-500 block w-full">Raw JSON (debug) <FontAwesomeIcon icon={faAngleDown} className={`ml-2 transition-all duration-500 ${showRaw ? "rotate-180" : ""}`}/></button>
                                        <pre className={`whitespace-break-spaces text-sm text-gray-500 overflow-hidden transition-all duration-500 ease-in-out ${showRaw ? "h-96" : "h-0"}`}>{JSON.stringify(result, null, 2)}</pre>

                                        
                                    </div>
                                    <button type="button" onClick={interviewStart} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer col-span-2">Start Interview</button>
                                </div>
                            )}
                        </form>
                    )}
                    { questions.length !== 0 && !finalResult && (
                        <>
                            <div id="last-question">
                                { !!score && 
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Score</h3>
                                        <p>{score}</p>
                                    </div>
                                }
                                { !!feedback && 
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Feedback</h3>
                                        <p>{feedback}</p>
                                    </div>
                                }
                            </div>
                           
                            <form id="interview-form" className="flex flex-col gap-4">
                                {!finish && (
                                    <>
                                        <h2 className="text-xl mt-8">{questions[currentIndex]}</h2>
                                        <div className="flex flex-col gap-2 mt-8">
                                            <label htmlFor="answer">Answer</label>
                                            <textarea placeholder="Input your answer" name="answer" id="answer" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} required value={answer} onChange={(e) => setAnswer(e.target.value)} />
                                        </div>
                                    </>
                                )}
                                
                                { hasNext ? 
                                    <button type="button" onClick={() => submitAnswer()} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Answer</button> : 
                                    <button type="button" onClick={() => finishInterview()} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Finish Interview</button>
                                }
                            </form>
                        </>
                    )}
                    { !!finalResult && (
                        <div>
                            <h2 className="text-2xl font-bold">Interview End!</h2> 
                            <h3 className="text-lg font-semibold underline mt-8">Your Result:</h3>
                            { !!finalResult?.overall_score && 
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Score</h3>
                                    <p>{finalResult?.overall_score}</p>
                                </div>
                            }
                            {finalResult.strengths?.length > 0 && (
                                <>
                                <h3 className="text-lg font-semibold mt-4">Strengths</h3>
                                <ul>
                                    {finalResult.strengths?.map((s: string, i: number) => (
                                    <li className="list-disc list-inside" key={i}>{s}</li>
                                    ))}
                                </ul>
                                </>
                            )}
                            {finalResult.weaknesses?.length > 0 && (
                                <>
                                <h3 className="text-lg font-semibold mt-4">Weaknesses</h3>
                                <ul>
                                    {finalResult.weaknesses?.map((s: string, i: number) => (
                                    <li className="list-disc list-inside" key={i}>{s}</li>
                                    ))}
                                </ul>
                                </>
                            )}
                            {finalResult.improvement_plan?.length > 0 && (
                                <>
                                <h3 className="text-lg font-semibold mt-4">Improvement Plan</h3>
                                <ul>
                                    {finalResult.improvement_plan?.map((s: string, i: number) => (
                                    <li className="list-disc list-inside" key={i}>{s}</li>
                                    ))}
                                </ul>
                                </>
                            )}
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8" type="button" onClick={restartInterview}>
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
  }