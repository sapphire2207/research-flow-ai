"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ScoreBadge } from "@/components/ScoreBadge";
import type { ResearchResponse } from "@/lib/types";

interface ResultsViewProps {
  result: ResearchResponse;
  onReset: () => void;
}

type TabId = "report" | "feedback" | "search" | "scraped";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "report", label: "Report" },
  { id: "feedback", label: "Feedback" },
  { id: "search", label: "Search Results" },
  { id: "scraped", label: "Sources Read" },
];

export function ResultsView({ result, onReset }: ResultsViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("report");

  const tabContent: Record<TabId, string> = {
    report: result.report,
    feedback: result.feedback,
    search: result.search_results,
    scraped: result.scraped_content,
  };

  const isDataLike = activeTab === "search" || activeTab === "scraped";

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">
      <div className="animate-enter">
        <header className="sticky top-0 z-20 -mx-5 border-b border-white/10 bg-[#0a0b0f]/90 px-5 py-5 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-200">
                Research complete
              </p>
              <h1 className="mt-1 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {result.topic}
              </h1>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-cyan-300/40 hover:bg-cyan-300/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/10"
              onClick={onReset}
              type="button"
            >
              <span aria-hidden="true">+</span>
              New research
            </button>
          </div>
        </header>

        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.035] p-2">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  className={`relative shrink-0 rounded-md px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-cyan-300/10 ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                  }`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                  {isActive ? (
                    <span className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <section
          className="mt-5 rounded-lg border border-white/10 bg-[#10141d]/85 p-5 shadow-2xl shadow-black/30 sm:p-7"
          key={activeTab}
        >
          {activeTab === "feedback" ? (
            <ScoreBadge feedback={result.feedback} />
          ) : null}
          <MarkdownRenderer content={tabContent[activeTab]} mono={isDataLike} />
        </section>
      </div>
    </main>
  );
}
