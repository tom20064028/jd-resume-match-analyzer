'use client';

import { useEffect, useState } from "react";

export default function CopilotPage() {

    useEffect(() => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            // setLoading(true);
            const formData = new FormData(form);
            const jd = formData.get("jd");
            const resume = formData.get("resume");
            const res1 = await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({ jd, resume }),
            })
            const analyzeData = await res1.json();
            const res2 = await fetch("/api/interview", {
                method: "POST",
                body: JSON.stringify({ jd }),
            })
            const interviewData = await res2.json();
            console.log({ analyzeData, interviewData });

        });
    }, []);

    return (

        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">AI Job Application Copilot</h1>
                    </div>
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="jd">JD</label>
                            <textarea
                                name="jd" id="jd" 
                                placeholder="Paste job description" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="resume">Resume</label>
                            <textarea
                                name="resume" id="resume"
                                placeholder="Paste your resume" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded-md`}>Analyze Application</button>
                        </div>
                    </form>
                    <div style={{ marginTop: 20 }}>
                    {/* results will appear here */}
                    </div>
                </div>
            </main>
        </div>
    );
  }