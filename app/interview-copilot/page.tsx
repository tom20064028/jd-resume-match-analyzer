'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { connection } from 'next/server'

export default async function InterviewCopilotPage() {
    await connection()
    const router = useRouter()
    const searchParams = useSearchParams()
    const exampleJD = `We are looking for a frontend developer with React, TypeScript, and API experience...`;

    type HistoryItem = {
        question: string;
        answer: string;
        score: number;
        feedback: string;
    };

    // type FinalResult = {
    //     overall_score: number,
    //     summary: string,
    //     improvement: string
    // };

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
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [finish, setFinish] = useState(false)

    const [history, setHistory] = useState<HistoryItem[]>([])
    // const [finalResult, setFinalResult] = useState<FinalResult>()

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
        const questionsParam = searchParams.get("questions")
        if (!!questionsParam) {
            const questions = questionsParam ? JSON.parse(decodeURIComponent(questionsParam)) : []
            setQuestions(questions)
        }
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

        // fetch("/api/interview-finish", {
        //     method: "POST",
        //     body: JSON.stringify({ history }),
        // }).then(res => res.json()).then(data => {
        //     let parsed;
    
        //     try {
        //         parsed = JSON.parse(data.raw);
        //         setFinalResult(parsed)
        //     } catch {
        //         parsed = {
        //             "overall_score": 0,
        //             "summary": "",
        //             "improvement": ""
        //         };
        //     }
            
        //     setLoading(false);
        // }).catch(err => {
        //     console.error(err);
        // }).finally(() => {
        //     setLoading(false);
        //     setStage(2)
        // }) 
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start relative">
                <a href="/" className="absolute top-12">
                    ← Back to Toolkit
                </a>
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
                    { questions.length !== 0 && (
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
                                    <button type="button" onClick={() => submitAnswer()} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Finish Interview</button>
                                }
                            </form>
                        </>
                    )}
                    {/* { stage === 2 && (
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
                            { !!finalResult?.improvement&& 
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Improvement</h3>
                                    <p>{finalResult?.improvement}</p>
                                </div>
                            }
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8" type="button" onClick={() => setStage(0)}>
                                Back to Home
                            </button>
                        </div>
                    )} */}
                </div>
            </main>
        </div>
    );
  }