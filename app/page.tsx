'use client';

import { useEffect, useState } from "react";
import Image from "next/image";


export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const form = document.querySelector("form");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData(form);
      const jd = formData.get("jd");
      const resume = formData.get("resume");
      fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ jd, resume }),
      }).then(res => res.json()).then(data => {
        let parsed;

        try {
          parsed = JSON.parse(data.raw);
        } catch {
          parsed = {
            score: 0,
            missing_skills: [],
            rewrite_suggestions: ["Invalid JSON from model"]
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
            <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} disabled={loading}>{loading ? "Analyzing..." : "Analyze"}</button>
          </form>
          {result && (
            <div className="flex flex-col gap-2 mt-4">
              <h2 className="text-2xl font-bold">Result</h2>         
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Score</h3>
                  <p>{result.score}</p>

                  <h3 className="text-lg font-semibold mt-4">Missing skills</h3>
                  <ul>
                    {result.missing_skills?.map((s: string, i: number) => (
                      <li className="list-disc list-inside" key={i}>{s}</li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-semibold mt-4">Rewrite suggestions</h3>
                  <ul>
                    {result.rewrite_suggestions?.map((s: string, i: number) => (
                      <li className="list-disc list-inside" key={i}>{s}</li>
                    ))}
                  </ul>

                  <h4 className="text-lg font-semibold mt-4">Raw JSON (debug)</h4>
                  <pre className="whitespace-break-spaces text-sm text-gray-500">{JSON.stringify(result, null, 2)}</pre>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
