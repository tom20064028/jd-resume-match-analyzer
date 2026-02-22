# JD–Resume Match Analyzer

A lightweight AI-powered web tool that compares a resume with a job description and returns:

- Match score
- Missing skills
- Rewrite suggestions

The project focuses on reliable LLM integration rather than UI complexity, ensuring stable structured outputs suitable for production-style workflows.



## 🚀 Live Demo

https://jd-resume-match-analyzer.vercel.app/



## 🛠 Tech Stack

- Next.js (App Router)
- OpenRouter API (LLM integration)
- Vercel (deployment)
- Structured JSON prompting with fallback validation



## ⚙️ How It Works

1. User pastes a job description and resume
2. The backend sends both to an LLM API
3. The model returns structured JSON containing:
   - score
   - missing skills
   - rewrite suggestions
4. The UI renders results with loading state and error safety

The system enforces strict JSON output and uses fallback parsing to prevent crashes from malformed responses.



## 💻 Run Locally

```bash
git clone <your repo>
cd <repo name>
npm install
npm run dev
````

Create `.env.local`:

```
OPENROUTER_API_KEY=your_key_here
```



## 🎯 Design Goals

* Demonstrate safe integration of LLM APIs in a web app
* Ensure predictable output formatting
* Provide a live demo suitable for technical interviews
* Keep the architecture simple and explainable



## ⚠️ Disclaimer

AI suggestions are indicative and may not fully reflect hiring decisions.



## 👤 Author

Built as a personal project to explore practical LLM integration in production-style frontend/backend workflows.