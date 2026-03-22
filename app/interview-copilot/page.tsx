'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function InterviewCopilotPage() {
    const exampleJD = `We are looking for a frontend developer with React, TypeScript, and API experience...`;

    type HistoryItem = {
        question: string;
        answer: string;
        score: number;
        feedback: string;
    };

    type FinalResult = {
        overall_score: number,
        summary: string,
        improvement: string
    };

    const [jd, setJd] = useState("")
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState(0)
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [score, setScore] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [finalResult, setFinalResult] = useState<FinalResult>()

    useEffect(() => {
        const jdForm = document.querySelector("#jd-form");
        jdForm?.addEventListener("submit", (e) => {
          e.preventDefault();
          console.log("test")
        //   setLoading(true);
        //   const formData = new FormData(jdForm as HTMLFormElement);
        //   const jd = formData.get("jd");
        //   fetch("/api/interview-start", {
        //     method: "POST",
        //     body: JSON.stringify({ jd }),
        //   }).then(res => res.json()).then(data => {
        //     let parsed;
    
        //     try {
        //       parsed = JSON.parse(data.raw);
        //     } catch {
        //       parsed = {
        //         question: ""
        //       };
        //     }
        //     console.log(parsed)
        //     setQuestion(parsed.question);
        //     setLoading(false);
        //   }).catch(err => {
        //     console.error(err);
        //   }).finally(() => {
        //     setLoading(false);
        //     setStage(1)
        //   }) 
        });
    }, []);

    const submitAnswer = () => {
        const interviewForm = document.querySelector("#interview-form");
        setLoading(true);
        const formData = new FormData(interviewForm as HTMLFormElement);
        const answer = formData.get("answer");
        fetch("/api/interview-turn", {
            method: "POST",
            body: JSON.stringify({ question, answer, history }),
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
            setQuestion(parsed.next_question);
            setLoading(false);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
            setAnswer("")

        }) 
    }

    const finishInterview = () => {

        fetch("/api/interview-finish", {
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
                    "summary": "",
                    "improvement": ""
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
                    { stage === 0 && (
                        <form id="jd-form" className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="jd">JD</label>
                                <textarea placeholder="Paste job description" name="jd" id="jd" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} required value={jd} onChange={(e) => setJd(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="resume">Resume</label>
                                <textarea
                                    name="resume" id="resume"
                                    placeholder="Paste your resume" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Start</button>
                                {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" type="button" onClick={() => setJd(exampleJD)}>
                                    Use example
                                </button> */}
                            </div>
                    
                            {/* {result && (
                            <div className="flex flex-col gap-2 mt-4">
                                <h2 className="text-2xl font-bold">Result</h2>         
                                <div className="mt-4">
                                {result.questions?.length > 0 && (
                                    <>
                                    <h3 className="text-lg font-semibold mt-4">Questions</h3>
                                    <ul>
                                        {result.questions?.map((s: string, i: number) => (
                                        <li className="list-disc list-inside" key={i}>{s}</li>
                                        ))}
                                    </ul>
                                    </>
                                )}
                                </div>
                            </div>
                            )} */}
                        </form>
                    )}
                    {/* { stage === 1 && (
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
                                { history.length !== 0 && 
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer mt-8" type="button" onClick={() => finishInterview()}>
                                        Finish Interview
                                    </button>
                                }
                            </div>
                           
                            <form id="interview-form" className="flex flex-col gap-4">
                                <h2 className="text-xl mt-8">{question}</h2>
                                <div className="flex flex-col gap-2 mt-8">
                                    <label htmlFor="answer">Answer</label>
                                    <textarea placeholder="Input your answer" name="answer" id="answer" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} required value={answer} onChange={(e) => setAnswer(e.target.value)} />
                                </div>
                                <button type="button" onClick={() => submitAnswer()} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Answer</button>
                            </form>
                        </>
                    )}
                    { stage === 2 && (
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