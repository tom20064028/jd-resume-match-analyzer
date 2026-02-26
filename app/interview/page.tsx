'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function InterviewPage() {
    const exampleJD = `We are looking for a frontend developer with React, TypeScript, and API experience...`;

    const [jd, setJd] = useState("")
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const form = document.querySelector("form");
        form?.addEventListener("submit", (e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData(form);
          const jd = formData.get("jd");
          fetch("/api/interview", {
            method: "POST",
            body: JSON.stringify({ jd }),
          }).then(res => res.json()).then(data => {
            let parsed;
    
            try {
              parsed = JSON.parse(data.raw);
            } catch {
              parsed = {
                questions: []
              };
            }
            console.log(parsed)
            setResult(parsed);
            setLoading(false);
          }).catch(err => {
            console.error(err);
            setLoading(false);
          });
        });
      }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
            
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold">AI Interview Simulator</h1>
                    </div>
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="jd">JD</label>
                            <textarea placeholder="Paste job description" name="jd" id="jd" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} required value={jd} onChange={(e) => setJd(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <button disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"> {loading ? "Generating..." : "Generate Questions"}</button>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" type="button" onClick={() => setJd(exampleJD)}>
                            Use example
                          </button>
                        </div>
                
                        {result && (
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
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
  }