"use client";

import { useEffect, useMemo, useState } from "react";

const STEPS = [
  {
    title: "Searching the web",
    description: "Finding recent, reliable sources",
  },
  {
    title: "Reading top source",
    description: "Scraping the strongest result",
  },
  {
    title: "Writing report",
    description: "Synthesizing evidence into markdown",
  },
  {
    title: "Reviewing report",
    description: "Scoring strengths and gaps",
  },
];

interface PipelineProgressProps {
  topic: string;
  forceComplete: boolean;
  currentStep?: number;
}

export function PipelineProgress({
  topic,
  forceComplete,
  currentStep = 0,
}: PipelineProgressProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const activeStep = useMemo(
    () => (forceComplete ? STEPS.length : currentStep),
    [currentStep, forceComplete],
  );

  const isHolding = !forceComplete && activeStep === STEPS.length - 1;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col justify-center px-5 py-12 sm:px-8">
      <div className="animate-enter">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-200">Research run</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {topic}
            </h1>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
            <p className="font-mono text-2xl font-semibold text-white">
              {elapsedSeconds}s
            </p>
            <p className="text-xs text-slate-400">elapsed</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const isDone = index < activeStep;
            const isActive = index === activeStep;

            return (
              <div
                className={`relative overflow-hidden rounded-lg border p-5 transition-colors duration-300 ${
                  isDone
                    ? "border-cyan-300/30 bg-cyan-300/10"
                    : isActive
                      ? "border-indigo-300/50 bg-indigo-400/10 shadow-[0_0_42px_rgba(99,102,241,0.18)]"
                      : "border-white/10 bg-white/[0.03]"
                }`}
                key={step.title}
              >
                {isActive ? <div className="active-step-glow" /> : null}
                <div className="relative z-10 flex items-start gap-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-colors ${
                      isDone
                        ? "border-cyan-200/40 bg-cyan-300/20 text-cyan-100"
                        : isActive
                          ? "border-indigo-200/50 bg-indigo-300/20 text-white"
                          : "border-white/10 bg-white/[0.03] text-slate-500"
                    }`}
                  >
                    {isDone ? <span aria-hidden="true">&#10003;</span> : index + 1}
                  </div>
                  <div>
                    <h2
                      className={`font-semibold ${
                        isDone || isActive ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {isActive && isHolding
                        ? "Still working on the final pass..."
                        : step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-400">
          Complex topics can take a minute or more. The pipeline is synchronous,
          so this progress reflects the live wait while the backend finishes.
        </p>
      </div>
    </section>
  );
}
