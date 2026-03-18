# AI Career Toolkit

AI-powered tools that help developers prepare for technical interviews using LLMs.

This project contains several AI-driven tools:

- Resume Analyzer
- Interview Simulator
- Coding Interview Judge (prototype)

Built with Next.js and LLM APIs.

## Tools

### 1️⃣ Resume Analyzer
Analyze how well a resume matches a job description.

Features:
- AI resume analysis
- Missing skills detection
- Interview question generation

### 2️⃣ Interview Simulator
Simulate a technical interview using AI.

The system:
1. Generates interview questions
2. Evaluates candidate answers
3. Provides feedback and follow-up questions
4. Gives a final interview evaluation

### 3️⃣ Coding Interview Judge
Prototype tool that evaluates coding interview answers using LLM reasoning.

(Currently in development.)

## Architecture
The application uses LLM APIs to power several AI workflows:

1. Resume Analysis
Job Description + Resume → Skill analysis → Missing skills → Interview questions

2. Interview Simulation
Job Description → AI question → Candidate answer → AI evaluation → Next question

3. Coding Interview Evaluation (Prototype)
Coding problem + candidate solution → AI reasoning → Bug detection + score

## 🛠 Tech Stack

- Next.js (App Router)
- React
- OpenRouter / LLM API
- Structured JSON prompting
- Vercel deployment

## 🚀 Live Demo

https://jd-resume-match-analyzer.vercel.app/



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