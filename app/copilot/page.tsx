export default function CopilotPage() {
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
                                placeholder="Paste job description" className="w-full border-2 border-gray-300 rounded-md p-2" rows={10} 
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="resume">Resume</label>
                            <textarea
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