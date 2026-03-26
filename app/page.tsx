'use client';

export default function Home() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
       
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">AI Career Toolkit</h1>
            <p className="text-lg text-gray-500">
              AI-powered tools to help developers prepare for technical interviews.<br/>
              Practice interviews, analyze resumes, and evaluate coding answers using LLMs.
            </p>

            <h3 className="text-2xl font-bold mt-4">
              About this project
            </h3>
            <p className="text-lg text-gray-500">
              AI Career Toolkit is a collection of AI-powered developer tools built with Next.js and LLM APIs.<br/>The goal is to explore how AI can assist developers in preparing for technical intervi
            </p>

            <h3 className="text-2xl font-bold mt-4">Interview Copilot</h3>
            <p className="text-lg text-gray-500">End-to-end interview preparation</p>
            <div className="flex justify-center">
              <a href="/interview-copilot" className="px-8 py-2 mt-4 rounded-md cursor-pointer text-center bg-blue-500 text-white inline-block">
                Start here
              </a>
            </div>
            
            <h3 className="text-2xl font-bold mt-4">
              Explore Individual Tools
            </h3>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <a href="/jd-resume-analyzer" className="card">
                <h4 className="text-xl font-bold">JD Resume Analyzer</h4>
                <div className="mt-4">Analyze how well your resume matches a job description.<br/>Identify missing skills and generate interview questions.</div>
              </a>
              <a href="/interview-simulator" className="card">
                <h4 className="text-xl font-bold">Interview Simulator</h4>
                <div className="mt-4">
                  Practice technical interviews with an AI interviewer.<br/>
                  Receive feedback, follow-up questions, and a final evaluation.
                </div>
              </a>
              <a href="/conding-interview"  className="card">
                <h4 className="text-xl font-bold">Coding Interview Judge</h4>
                <div className="mt-4">
                  Evaluate coding answers using AI.<br /><br />

                  👉 Use Example to try<br /><br />

                  (Prototype)
                </div>
              </a>
            </div>

            <h3 className="text-2xl font-bold mt-4">
              How to Try
            </h3>
            <ol className="text-lg text-gray-500 mt-2 list-decimal pl-6">
              <li>
                Go to Interview Copilot  
              </li>
              <li>
                Paste a job description and resume  
              </li>
              <li>
                Start interview preparation  
              </li>
              <li>
                Try the interview simulator  
              </li>
            </ol>

            
          </div>
        </div>
      </main>
    </div>
  );
}
