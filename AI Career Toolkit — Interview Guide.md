# AI Career Toolkit — Interview Guide

## 1. Project Positioning (最重要)

不要說：

* 我做咗 resume analyzer + interview simulator + coding judge

要說：

* I built an AI-powered interview preparation platform that helps developers go from job description analysis to simulated interviews and final evaluation.

---

## 2. 30 秒 Elevator Pitch（必背）

I built an AI interview preparation platform using Next.js and LLM APIs.

The system allows users to paste a job description and resume, then analyzes skill gaps and generates tailored interview questions.

Users can then go through a simulated interview where each answer is evaluated in real-time, followed by a final report with strengths and improvement areas.

The key focus was designing multi-step AI workflows and maintaining state across the entire user journey.

---

## 3. 常見追問 & 答法

### Q1: What was challenging?

One challenge was managing state across multiple steps, especially passing data like interview questions and history between pages.

I solved it by structuring the flow carefully and using URL parameters and React state to maintain continuity.

---

### Q2: Why multiple APIs?

I separated APIs based on product context.

For example, the interview simulator uses a simpler evaluation format, while the copilot flow requires structured outputs like strengths and weaknesses.

This avoids breaking existing features and keeps the system scalable.

---

### Q3: What did you learn?

I learned how to design AI workflows beyond simple prompts.

This includes structuring outputs, managing multi-turn interactions, and integrating them into a cohesive product experience.

---

## 4. CV Version（最終版）

AI Career Toolkit (AI Interview Preparation Platform)

• Built an end-to-end AI-powered platform that helps developers prepare for technical interviews, from job description analysis to simulated interviews and final evaluation.

• Designed multi-step LLM workflows, including resume analysis, dynamic interview generation, real-time answer evaluation, and structured final reporting.

• Implemented multi-turn conversation handling with state management across pages using React and Next.js.

• Developed structured JSON prompting strategies to ensure reliable AI outputs for UI rendering.

• Deployed full-stack application on Vercel.

---

## 5. 核心賣點（你要記住）

* End-to-end AI product（唔係單一工具）
* Multi-step workflow design
* Multi-turn AI interaction
* Structured output for UI
* State management across pages

---

## 6. 一句總結（最精簡）

I built an end-to-end AI product that simulates the full interview preparation process using LLMs.
