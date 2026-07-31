# 🧠 Autonomous Multi-Agent Research System — Backend

An enterprise-grade, multi-agent AI research engine built with **FastAPI**, **LangGraph**, **LangChain**, and **Mistral AI**. This backend orchestrates specialized AI agents in a stateful pipeline to perform real-time web search, deep page scraping, structured report synthesis, and critical content evaluation.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Core Concepts & Agent Workflow](#-core-concepts--agent-workflow)
- [Directory Structure](#-directory-structure)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Running the Server](#-running-the-server)

---

## 🚀 Overview & Architecture

The backend delivers an autonomous research pipeline that accepts a user topic, executes deep internet research, generates a structured markdown report, and critically reviews the output.

Key architectural highlights:
- **Stateful Agent Workflow**: Managed via **LangGraph** (`StateGraph`) with a single source of state truth passed sequentially through nodes.
- **Specialized AI Agents**: Decoupled ReAct agents and LCEL (LangChain Expression Language) chains handling single-responsibility tasks.
- **Real-Time Streaming**: **Server-Sent Events (SSE)** endpoint emitting granular step updates to the frontend as each agent executes.
- **Deterministic LLM Calls**: Powered by **Mistral AI** (`mistral-small-latest`, `temperature=0`).

---

## 📊 System Architecture Diagram

```
                 +-----------------------+
                 | POST /research/stream |
                 +-----------+-----------+
                             |
                             v
                 +-----------------------+
                 |     ResearchState     |
                 |     (topic, state)    |
                 +-----------+-----------+
                             |
                             v
                 +-----------------------+
                 |    1. Search Node     |
                 |  - ReAct Agent        |
                 |  - Tavily Web Search  |
                 |  - Discovers links    |
                 +-----------+-----------+
                             |
                             v
                 +-----------------------+
                 |    2. Reader Node     |
                 |  - ReAct Agent        |
                 |  - BeautifulSoup      |
                 |  - Scrapes top page   |
                 +-----------+-----------+
                             |
                             v
                 +-----------------------+
                 |    3. Writer Node     |
                 |  - LCEL Chain         |
                 |  - Drafts MD Report   |
                 +-----------+-----------+
                             |
                             v
                 +-----------------------+
                 |    4. Critic Node     |
                 |  - LCEL Chain         |
                 |  - Review & Score     |
                 +-----------+-----------+
                             |
                             v
                          ( END )
```

---

## 🧩 Core Concepts & Agent Workflow

### 1. Shared Pipeline State (`graph/state.py`)
State is defined using Python's `TypedDict` as `ResearchState`:
- **`topic`** (`str`): The initial user research prompt.
- **`search_results`** (`str`): Web titles, URLs, and snippets retrieved during web search.
- **`scraped_content`** (`str`): Cleaned raw text extracted from top web sources.
- **`report`** (`str`): Final drafted research report in structured Markdown.
- **`feedback`** (`str`): Constructive criticism and numerical score evaluated by the critic.

### 2. The 4 Autonomous Agents (`agents/` & `graph/nodes.py`)

1. **Search Agent (`search_node`)**:
   - **Role**: Discovers initial information and links on the research topic.
   - **Implementation**: ReAct agent (`build_search_agent()`) equipped with `web_search` tool (`tools/search_tool.py`).
   - **External Service**: **Tavily Search API** returning top 5 relevant web snippets and URLs.

2. **Reader Agent (`reader_node`)**:
   - **Role**: Deep-dives into content by inspecting full web pages.
   - **Implementation**: ReAct agent (`build_reader_agent()`) equipped with `scrape_url` tool (`tools/scraper_tool.py`).
   - **Methodology**: Selects the best URL from search results, fetches HTML via `requests`, parses clean body text using `BeautifulSoup` (stripping noise like `<script>`, `<style>`, `<nav>`, `<footer>`), and caps output at 3,000 characters.

3. **Writer Agent (`writer_node`)**:
   - **Role**: Synthesizes all gathered intelligence into a cohesive report.
   - **Implementation**: LangChain LCEL Chain (`writer_prompt | llm | StrOutputParser()`).
   - **Report Structure**:
     - Introduction
     - Key Findings (minimum 3 well-explained points)
     - Conclusion
     - Sources (list of discovered URLs)

4. **Critic Agent (`critic_node`)**:
   - **Role**: Quality assurance and critique.
   - **Implementation**: LangChain LCEL Chain (`critic_prompt | llm | StrOutputParser()`).
   - **Output Format**: Numerical score (`Score: X/10`), key strengths, areas for improvement, and a single-line final verdict.

---

## 📁 Directory Structure

```
backend/
├── app/
│   └── main.py             # FastAPI application entrypoint & middleware configuration
├── requirements.txt        # Python dependency manifest
├── Readme.md               # Backend documentation
├── .env                    # Environment key storage (API keys)
├── api/
│   ├── routes.py           # REST and SSE API endpoint handlers
│   └── schemas.py          # Pydantic request & response models
├── agents/
│   ├── search_agent.py     # Search agent factory function (ReAct)
│   ├── reader_agent.py     # Reader agent factory function (ReAct)
│   ├── writer_agent.py     # LCEL Writer chain
│   └── critic_agent.py     # LCEL Critic chain
├── graph/
│   ├── state.py            # LangGraph TypedDict state schema
│   ├── nodes.py            # Node execution functions for each pipeline step
│   └── graph.py            # StateGraph builder and workflow compilation
├── services/
│   ├── llm.py              # ChatMistralAI model client setup
│   └── prompts.py          # System and human prompt templates
└── tools/
    ├── search_tool.py      # Tavily web search tool definition
    └── scraper_tool.py     # BeautifulSoup web scraper tool definition
```

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance Web API framework |
| **Orchestration** | [LangGraph](https://langchain-ai.github.io/langgraph/) | Cyclic/Stateful Multi-agent workflow graph |
| **Agent Framework** | [LangChain](https://www.langchain.com/) | ReAct agent creation, LCEL pipelines, tool binding |
| **LLM Provider** | [Mistral AI](https://mistral.ai/) (`mistral-small-latest`) | Reasoning and content generation engine |
| **Search Engine** | [Tavily API](https://tavily.com/) | AI-optimized web search |
| **Scraper** | `BeautifulSoup4` + `requests` | HTML cleaning and DOM extraction |
| **Data Validation** | [Pydantic v2](https://docs.pydantic.dev/) | Request/Response schema enforcement |

---

## 📡 API Reference

### 1. Health Check
- **`GET /`**
- **Response**: `{"message": "Research AI Backend is Running"}`

---

### 2. Synchronous Research
- **`POST /research`**
- **Request Body**:
  ```json
  {
    "topic": "Quantum Computing Applications in Cryptography"
  }
  ```
- **Response Body**:
  ```json
  {
    "topic": "Quantum Computing Applications in Cryptography",
    "search_results": "...",
    "scraped_content": "...",
    "report": "...",
    "feedback": "..."
  }
  ```

---

### 3. Real-Time Streaming (SSE)
- **`POST /research/stream`**
- **Media Type**: `text/event-stream`
- **Request Body**:
  ```json
  {
    "topic": "Quantum Computing Applications in Cryptography"
  }
  ```
- **Stream Event Sequence**:
  - `data: {"type": "step", "step": 0}` — Pipeline Initialized
  - `data: {"type": "step", "step": 1}` — Search Node Completed
  - `data: {"type": "step", "step": 2}` — Reader Node Completed
  - `data: {"type": "step", "step": 3}` — Writer Node Completed
  - `data: {"type": "step", "step": 4}` — Critic Node Completed
  - `data: {"type": "complete", "result": { ...full research payload... }}` — Pipeline Complete

---

## 🔧 Setup & Installation

### 1. Prerequisites
- Python 3.10+
- Valid API keys for **Mistral AI** and **Tavily**

### 2. Environment Setup
Create a virtual environment and install dependencies:

```bash
cd backend
python -m venv .venv

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MISTRAL_API_KEY=your_mistral_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

---

## 🏃 Running the Server

Start the FastAPI development server with Uvicorn:

```bash
uvicorn app.main:app --reload --port 8000
```

The API server will run at `http://localhost:8000`. You can test the endpoints interactively via the built-in Swagger UI at `http://localhost:8000/docs`.
