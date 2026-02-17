'use client';

import { useEffect, useState } from "react";
import Image from "next/image";


export default function Home() {
  const [result, setResult] = useState<any>(null);
  useEffect(() => {
    const form = document.querySelector("form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const jd = formData.get("jd");
      const resume = formData.get("resume");
      fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ jd, resume }),
      }).then(res => res.json()).then(data => {
        console.log(JSON.parse(data.raw));
        setResult(JSON.parse(data.raw));
      });
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
       
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">JD Resume Match Analyzer</h1>
            <p className="text-lg text-gray-500">
              Upload a JD and a resume to see how well the resume matches the JD.
            </p>
          </div>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="jd">JD</label>
              <textarea name="jd" id="jd" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="resume">Resume</label>
              <textarea name="resume" id="resume" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Analyze</button>
          </form>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Result</h2>
            {/* <pre className="text-sm text-gray-500">
              <code id="result">{result}</code>
            </pre> */}
            {result && (
              <div style={{ marginTop: 20 }}>
                <h3>Score</h3>
                <p>{result.score}</p>

                <h3>Missing skills</h3>
                <ul>
                  {result.missing_skills?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                <h3>Rewrite suggestions</h3>
                <ul>
                  {result.rewrite_suggestions?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>

                <h4>Raw JSON (debug)</h4>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
