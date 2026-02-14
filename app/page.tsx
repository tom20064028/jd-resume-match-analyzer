'use client';

import { useEffect, useState } from "react";
import Image from "next/image";


export default function Home() {

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
        console.log(data);
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
        </div>
      </main>
    </div>
  );
}
