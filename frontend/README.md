# 🎨 ResearchFlow AI — Next.js Frontend

A modern, high-performance web interface for **ResearchFlow AI** built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It connects to the autonomous multi-agent backend, featuring real-time pipeline streaming via Server-Sent Events (SSE), tabbed markdown reports, and dynamic critic score visualizations.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture & State Flow](#-architecture--state-flow)
- [Component Overview](#-component-overview)
- [API Integration & SSE Streaming](#-api-integration--sse-streaming)
- [Directory Structure](#-directory-structure)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)

---

## ✨ Features

- **Real-Time Pipeline Tracking**: Live step progress indicator tracking backend agent nodes as they run (Search $\rightarrow$ Reader $\rightarrow$ Writer $\rightarrow$ Critic) with a live timer.
- **SSE Streaming with HTTP Fallback**: Primary connection attempts Server-Sent Events (`POST /research/stream`) for real-time progress events, gracefully falling back to standard HTTP POST (`POST /research`) if needed.
- **Tabbed Results View**: Seamlessly switch between the **Final Report**, **Critic Feedback**, **Raw Search Results**, and **Scraped Source Content**.
- **Dynamic Score Badge**: Circular CSS conic-gradient indicator parsing and displaying the Critic Agent's rating (X/10).
- **Rich Markdown Rendering**: Formatted rendering of headings, tables, links, lists, and code snippets powered by `react-markdown` and `remark-gfm`.
- **Modern Dark Aesthetics**: Premium glassmorphism UI styled with Tailwind CSS v4, custom gradients, glow effects, and smooth entry transitions.

---

## 🏗️ Architecture & State Flow

The root view controller ([app/page.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/app/page.tsx)) manages the application state through three distinct view phases:

```
                  +---------------------+
                  |   ViewState: idle   |
                  |    (TopicInput)     |
                  +----------+----------+
                             |
                      Submit Topic
                             v
                  +---------------------+
                  |  ViewState: loading |
                  | (PipelineProgress)  |
                  +----------+----------+
                             |
                     SSE Stream / POST
                             v
                  +---------------------+
                  | ViewState: results  |
                  |    (ResultsView)    |
                  +---------------------+
```

- **`idle`**: Displays the hero input bar ([TopicInput.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/TopicInput.tsx)) with quick preset topic buttons.
- **`loading`**: Displays live step progress ([PipelineProgress.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/PipelineProgress.tsx)) and an active elapsed seconds counter.
- **`results`**: Displays the tabbed results panel ([ResultsView.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/ResultsView.tsx)) rendering the generated report and agent metadata.

---

## 🧩 Component Overview

### 1. `TopicInput.tsx` ([components/TopicInput.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/TopicInput.tsx))
- Main landing view with a search input box.
- Features preset example topic badges (*Quantum error correction*, *State of EV battery tech*, etc.).
- Displays user-friendly error alerts with retry triggers if backend connectivity fails.

### 2. `PipelineProgress.tsx` ([components/PipelineProgress.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/PipelineProgress.tsx))
- Renders 4 steps:
  1. **Searching the web** — Finding recent, reliable sources
  2. **Reading top source** — Scraping the strongest result
  3. **Writing report** — Synthesizing evidence into markdown
  4. **Reviewing report** — Scoring strengths and gaps
- Animated active step glow and completed checkmarks.
- Real-time timer counting elapsed seconds during execution.

### 3. `ResultsView.tsx` ([components/ResultsView.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/ResultsView.tsx))
- Tab navigation between `Report`, `Feedback`, `Search Results`, and `Sources Read`.
- Sticky header featuring the topic title and a "New research" reset button.

### 4. `ScoreBadge.tsx` ([components/ScoreBadge.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/ScoreBadge.tsx))
- Regex score parser (`Score: X/10`) targeting feedback returned by the Critic agent.
- Renders a dynamic CSS `conic-gradient` circular score ring indicator.

### 5. `MarkdownRenderer.tsx` ([components/MarkdownRenderer.tsx](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/components/MarkdownRenderer.tsx))
- Custom GitHub Flavored Markdown renderer powered by `react-markdown` and `remark-gfm`.
- Supports monospace mode for raw scraped data and search outputs.

---

## 📡 API Integration & SSE Streaming (`lib/api.ts`)

The API client layer ([lib/api.ts](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/lib/api.ts)) connects to the FastAPI backend:

- **`fetchResearchStream(topic, onStepChange)`**:
  - Sends a `POST` request to `/research/stream`.
  - Uses `response.body.getReader()` to stream chunked SSE buffers (`data: {...}`).
  - Emits `onStepChange(stepIndex)` as agent steps finish.
  - Resolves with the final payload once the `type: "complete"` SSE event arrives.

- **`fetchResearch(topic)`**:
  - Fallback synchronous HTTP POST to `/research`.
  - Returns a promise containing `ResearchResponse`.

- **Type Safety & Data Contracts ([lib/types.ts](file:///c:/Users/sreem/Desktop/research-flow-ai/frontend/lib/types.ts))**:
  - Enforces `ResearchRequest` and `ResearchResponse` interfaces.

---

## 📁 Directory Structure

```
frontend/
├── app/
│   ├── globals.css         # Tailwind v4 styles, custom typography & dark theme tokens
│   ├── layout.tsx          # Root layout featuring Urbanist & Geist Mono fonts
│   └── page.tsx            # Main stateful page controller (idle -> loading -> results)
├── components/
│   ├── TopicInput.tsx       # Search hero section & preset badges
│   ├── PipelineProgress.tsx # Live agent progress timeline & elapsed timer
│   ├── ResultsView.tsx      # Tabbed report viewer & header controls
│   ├── ScoreBadge.tsx       # Conic-gradient circular critic score indicator
│   └── MarkdownRenderer.tsx # GitHub Flavored Markdown parser
├── lib/
│   ├── api.ts              # SSE stream reader & HTTP fetch handlers with error types
│   └── types.ts            # TypeScript interfaces for request/response payloads
├── public/                 # Static assets & favicons
├── package.json            # Dependencies & build scripts
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Frontend documentation
```

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **Next.js 16** | React Framework (App Router, Server/Client components) |
| **React 19** | UI Library |
| **TypeScript 5** | Static type checking |
| **Tailwind CSS v4** | Utility-first styling & dark mode design system |
| **react-markdown** | Markdown rendering engine |
| **remark-gfm** | GitHub Flavored Markdown plugin (tables, tasklists, autolinks) |

---

## 🔧 Setup & Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in `frontend/`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 🏃 Running the Application

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```
