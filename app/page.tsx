'use client';

export default function Home() {

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Subtle background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/40"
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-zinc-900/40 sm:p-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-4 py-1 text-sm text-gray-600 dark:border-gray-800 dark:bg-zinc-900/40 dark:text-gray-300">
                AI-powered tools for interview prep
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                AI Interview Training, Powered by Your Resume
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Get personalized interview questions, real-time feedback, and a clear improvement path — all in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/60 p-5 dark:border-gray-800 dark:bg-zinc-900/30">
              <h3 className="text-xl font-semibold">About this project</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                AI Career Toolkit is a collection of AI-powered developer tools built with Next.js and LLM APIs. The goal
                is to explore how AI can assist developers in preparing for technical interviews.
              </p>
            </div>
            <div>
              <div className="rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-5 dark:border-blue-900/60 dark:from-blue-950/40 dark:to-indigo-950/40">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Interview Copilot</h3>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">
                      End-to-end interview preparation.
                    </p>
                  </div>

                  <a
                    href="/interview-copilot"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:hover:bg-blue-500"
                  >
                    Start Your Interview
                  </a>
                </div>
              </div>
              <div className="flex w-full justify-end text-sm text-gray-400 gap-4 mt-4 px-5">
                <a href="/report">View Last Report</a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">How to Try</h2>

          <ol className="mt-4 space-y-3 text-gray-700 dark:text-gray-200">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                1
              </span>
              <span>Paste your resume and job description</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                2
              </span>
              <span>Practice a personalized AI interview</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                3
              </span>
              <span>Get feedback and improve instantly</span>
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Explore Individual Tools</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Pick a tool to practice, analyze, or evaluate your interview readiness.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/jd-resume-analyzer"
              className="card group bg-white/70 dark:bg-zinc-900/30 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h4 className="text-lg font-bold group-hover:text-blue-700 dark:group-hover:text-blue-400">
                JD Resume Analyzer
              </h4>
              <div className="mt-3 text-gray-600 dark:text-gray-300">
                Analyze how well your resume matches a job description. Identify missing skills and generate interview
                questions.
              </div>
            </a>

            <a
              href="/interview-simulator"
              className="card group bg-white/70 dark:bg-zinc-900/30 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h4 className="text-lg font-bold group-hover:text-blue-700 dark:group-hover:text-blue-400">
                Interview Simulator
              </h4>
              <div className="mt-3 text-gray-600 dark:text-gray-300">
                Practice technical interviews with an AI interviewer. Receive feedback, follow-up questions, and a final
                evaluation.
              </div>
            </a>

            <a
              href="/coding-interview"
              className="card group bg-white/70 dark:bg-zinc-900/30 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h4 className="text-lg font-bold group-hover:text-blue-700 dark:group-hover:text-blue-400">
                Coding Interview Judge
              </h4>
              <div className="mt-3 text-gray-600 dark:text-gray-300">
                Evaluate coding answers using AI. Use example to try the prototype.
                <div className="mt-2 inline-flex items-center rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-zinc-900/30 dark:text-gray-200">
                  Prototype
                </div>
              </div>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}
