"use client";

import type { FormEvent } from "react";

interface TopicInputProps {
  topic: string;
  errorTitle: string | null;
  errorMessage: string | null;
  onTopicChange: (topic: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
}

const EXAMPLE_TOPICS = [
  "Quantum error correction",
  "State of EV battery tech",
  "AI drug discovery platforms",
  "Carbon removal markets",
];

export function TopicInput({
  topic,
  errorTitle,
  errorMessage,
  onTopicChange,
  onSubmit,
  onRetry,
}: TopicInputProps) {
  const trimmedTopic = topic.trim();
  const isEmpty = trimmedTopic.length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEmpty) {
      onSubmit();
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl flex-col justify-center px-5 py-12 sm:px-8">
      <div className="animate-enter">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
          Multi-agent research pipeline
        </div>

        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl">
            ResearchFlow AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Autonomous multi-agent research, from query to critiqued report.
          </p>
        </div>

        <form
          className="mt-10 rounded-lg border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/40 backdrop-blur"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="topic">
              Research topic
            </label>
            <input
              id="topic"
              className={`min-h-14 flex-1 rounded-md border bg-slate-950/70 px-4 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10 ${
                errorMessage && isEmpty
                  ? "border-rose-400/70"
                  : "border-white/10"
              }`}
              placeholder="Enter a research topic..."
              value={topic}
              onChange={(event) => onTopicChange(event.target.value)}
            />
            <button
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition-transform duration-200 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              disabled={isEmpty}
              type="submit"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                -&gt;
              </span>
              Start research
            </button>
          </div>
        </form>

        {isEmpty && topic.length > 0 ? (
          <p className="mt-3 text-sm text-rose-200">
            Enter a topic before starting the research run.
          </p>
        ) : null}

        {errorMessage ? (
          <div className="mt-5 rounded-lg border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold">{errorTitle}</p>
                <p className="mt-1 leading-6 text-rose-100/80">
                  {errorMessage}
                </p>
              </div>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md border border-rose-200/20 px-3 py-2 font-medium text-rose-50 transition-colors hover:bg-rose-100/10 focus:outline-none focus:ring-4 focus:ring-rose-300/20"
                onClick={onRetry}
                type="button"
              >
                <span aria-hidden="true">R</span>
                Retry
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {EXAMPLE_TOPICS.map((exampleTopic) => (
            <button
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-cyan-300/10"
              key={exampleTopic}
              onClick={() => onTopicChange(exampleTopic)}
              type="button"
            >
              {exampleTopic}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
