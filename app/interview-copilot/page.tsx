'use client';

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function QuestionsFromSearchParams({ onSetFocus, focusAreas }: { onSetFocus: (qs: string[]) => void, focusAreas: string[] }) {
    const searchParams = useSearchParams();
    // const questionsParam = searchParams.get("questions");
    const focusParam = searchParams.get("focus")

    useEffect(() => {
        console.log("test")
        if (!focusParam) {
            onSetFocus([])
            return;
        }

        try {
            const decoded = decodeURIComponent(focusParam);
            const parsed = JSON.parse(decoded);
            onSetFocus(Array.isArray(parsed) ? parsed : focusAreas);
        } catch {
            onSetFocus([]);
        }
    }, [focusParam]);

    return null;
}

export default function InterviewCopilotPage() {

    const difficultyLevel = ["easy", "medium", "hard"]
    const maxQuestionOptions = [3, 5, 8]

    const router = useRouter()
    
    type HistoryItem = {
        question: string;
        answer: string;
        score: number;
        feedback: string;
    };

    type FinalResult = {
        overall_score: number,
        summary: string,
        strengths: string[],
        weaknesses: Weakness[],
        improvement_plan: string[]
    };

    type Weakness = {
        topic: string,
        description: string
    }

    type InterviewSession = {
        focusAreas: string[]
        currentFocus: string
        currentQuestion: string
        questionCount: number
        history: HistoryItem[]
        started: boolean
        finished: boolean
        finalResult: FinalResult | null,
        difficulty: "easy" | "medium" | "hard"
        previousDifficulty: "easy" | "medium" | "hard" | "",
        maxQuestion: number
    }

    const [jd, setJd] = useState("")
    const [resume, setResume] = useState("")

    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState("")
    const [showRaw, setShowRaw] = useState(false);

    const [session, setSession] = useState<InterviewSession>({
        focusAreas: [],
        currentFocus: "",
        currentQuestion: "",
        questionCount: 0,
        history: [],
        started: false,
        finished: false,
        finalResult: null,
        difficulty: "medium",
        previousDifficulty: "",
        maxQuestion: maxQuestionOptions[1]
    })
    
    const latestTurn = session.history[session.history.length - 1]

    const analyze = () => {
        setLoading(true);
        fetch("/api/interview-copilot", {
            method: "POST",
            body: JSON.stringify({ jd, resume, focusAreas: session.focusAreas }),
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
            if (session.focusAreas.length === 0) {
                setSession(prev => ({
                    ...prev,
                    focusAreas: parsed.missing_skills
                }))
            }
        }).catch(err => {
            console.error(err); 
        }).finally(() => {
            setLoading(false);
        });
    }

    const interviewStart = () => {
        setSession(prev => ({
            ...prev,
            currentQuestion: result.interview_questions[0],
            questionCount: 1,
            currentFocus: prev.focusAreas.length > 1 ? prev.focusAreas[0] : "",
            started: true
        }))
    }

    const submitAnswer = () => {
        const interviewForm = document.querySelector("#interview-form");
        setLoading(true);
        console.log(session)
        const formData = new FormData(interviewForm as HTMLFormElement);
        const answer = formData.get("answer");
        fetch("/api/interview-turn", {
            method: "POST",
            body: JSON.stringify({ question: session.currentQuestion, answer, history: session.history, focusAreas: session.focusAreas, currentFocus: session.currentFocus, difficulty: session.difficulty }),
        }).then(res => res.json()).then(data => {
            let parsed;
    
            try {
                parsed = JSON.parse(data.raw);
            } catch {
                parsed = {
                    score: 0,
                    feedback: "",
                    next_question: "",
                    next_focus: ""
                };
            }
            setSession(prev => {
                const hasNext = prev.questionCount < prev.maxQuestion
                return {
                    ...prev,
                    currentFocus: parsed.next_focus,
                    history: [
                        ...prev.history,
                        {
                            question: prev.currentQuestion,
                            answer: String(answer ?? ""),
                            score: parsed.score,
                            feedback: parsed.feedback,
                        }
                    ],
                    ...(hasNext && {questionCount: prev.questionCount + 1, currentQuestion: parsed.next_question}),
                    ...(!hasNext && {finished: true}),
                    ...(hasNext && {difficulty: parsed.score <= 4 ? "easy" : parsed.score >= 8 ? "hard" : "medium"}),
                    ...(hasNext && {previousDifficulty: prev.difficulty}),
                }
            })
            setLoading(false);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
            setAnswer("")
            console.log(session)
            // localStorage.setItem("currentInterviewSession", JSON.stringify(session))
        }) 
    }

    const finishInterview = () => {

        fetch("/api/interview-finish-copilot", {
            method: "POST",
            body: JSON.stringify({ history: session.history }),
        }).then(res => res.json()).then(data => {
            let parsed: FinalResult;
    
            try {
                parsed = JSON.parse(data.raw);
                setSession(prev => ({
                    ...prev,
                    finalResult: parsed
                }))
            } catch {
                parsed = {
                    "overall_score": 0,
                    "summary": "",
                    "strengths": [],
                    "weaknesses": [],
                    "improvement_plan": []
                };
            }
            const existing = JSON.parse(localStorage.getItem("history") || "[]")
            const updated = [...existing, parsed].slice(-5)

            localStorage.setItem("history", JSON.stringify(updated))
            localStorage.setItem("currentInterviewSession", JSON.stringify({...session, finalResult: parsed}))
            console.log("Finished interview. Going to report page...")
            setLoading(false);
            router.push("/report")
        }).catch(err => {
            console.error(err);
            setLoading(false);
        })
    }

    useEffect(() => {
        const saved = localStorage.getItem("currentInterviewSession")
        if (saved) {
            const parsed = JSON.parse(saved)
            if (parsed) {
                setSession(parsed)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("currentInterviewSession", JSON.stringify(session))
    }, [session])

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start relative">
                <Suspense fallback={null}>
                    <QuestionsFromSearchParams onSetFocus={(focusAreas) => setSession(prev => ({
                        ...prev,
                        focusAreas: focusAreas
                    }))} focusAreas={session.focusAreas} />
                </Suspense>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">AI Interview Copilot</h1>
                        <p className="text-lg text-gray-500">
                            Pratise your interview.
                        </p>
                    </div>
                    { !session.started && (
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
                                <button type="button" onClick={analyze} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer col-span-2">Analyze</button>
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

                                        <button type="button" onClick={() => setShowRaw(!showRaw)} className="text-sm font-semibold mt-4 text-center text-gray-500 block w-full">Raw JSON (debug) <FontAwesomeIcon icon={faAngleDown} className={`ml-2 transition-all duration-500 ${showRaw ? "rotate-180" : ""}`}/></button>
                                        <pre className={`whitespace-break-spaces text-sm text-gray-500 overflow-hidden transition-all duration-500 ease-in-out ${showRaw ? "h-96" : "h-0"}`}>{JSON.stringify(result, null, 2)}</pre>
                                    </div>
                                    <div className="self-end">
                                        <label htmlFor="maxQuestion" className="mr-4">Interview length</label>
                                        <select name="maxQuestion" id="maxQuestion" value={session.maxQuestion} onChange={(e) => setSession(prev => ({ ...prev, maxQuestion: parseInt(e.target.value) }))} className="border-2 border-gray-300 rounded-md py-2 px-4">
                                            {maxQuestionOptions.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="button" onClick={interviewStart} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer col-span-2">Start Interview</button>
                                </div>
                            )}
                        </form>
                    )}
                    { session.started && !session.finalResult && (
                        <>
                            <div id="last-question">
                                { !!latestTurn?.score && 
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Score</h3>
                                        <p>{latestTurn?.score}</p>
                                    </div>
                                }
                                { !!latestTurn?.feedback && 
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold">Feedback</h3>
                                        <p>{latestTurn?.feedback}</p>
                                    </div>
                                }
                            </div>
                           
                            <form id="interview-form" className="flex flex-col gap-4">
                                {session.finished ? (
                                    <button type="button" onClick={() => finishInterview()} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Finish Interview</button>
                                ) : (
                                    <div className="flex flex-col gap-2 mt-8">
                                        <div className="text-sm text-gray-500 self-end">
                                            Question {session.questionCount} of {session.maxQuestion}
                                        </div>
                                        <div className="text-sm text-gray-500 self-end">
                                            <div className="inline-block mr-2">Difficulty: </div>
                                            {!!session.previousDifficulty && session.previousDifficulty !== session.difficulty ? session.previousDifficulty + " → " : ""} 
                                            <div className="inline-block mr-2">{session.difficulty}</div>
                                            {!!session.previousDifficulty ? 
                                                (difficultyLevel.indexOf(session.difficulty) > difficultyLevel.indexOf(session.previousDifficulty) ?
                                                    "↑" : 
                                                    difficultyLevel.indexOf(session.difficulty) < difficultyLevel.indexOf(session.previousDifficulty) ? 
                                                        "↓" : ""
                                                ) : ""
                                            }
                                        </div>
                                        <h2 className="text-xl">{session.currentQuestion}</h2>
                                        <div className="flex flex-col gap-2 mt-8">
                                            <label htmlFor="answer">Answer</label>
                                            <textarea placeholder="Input your answer" name="answer" id="answer" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} required value={answer} onChange={(e) => setAnswer(e.target.value)} />
                                        </div>
                                        <button type="button" onClick={() => submitAnswer()} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Answer</button>
                                    </div>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
  }