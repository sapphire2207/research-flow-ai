"use client";

import { useState } from "react";
import { PipelineProgress } from "../components/PipelineProgress";
import { ResultsView } from "../components/ResultsView";
import { TopicInput } from "../components/TopicInput";
import { fetchResearch, fetchResearchStream, ResearchError } from "../lib/api";
import type { ResearchErrorKind } from "../lib/api";
import type { ResearchResponse } from "../lib/types";

type ViewState = "idle" | "loading" | "results";

interface UiError {
  title: string;
  message: string;
  kind: ResearchErrorKind;
}

function toUiError(error: unknown): UiError {
  if (error instanceof ResearchError) {
    const title =
      error.kind === "network"
        ? "Can't reach the ResearchFlow AI backend"
        : "Research request failed";

    return {
      title,
      message: error.message,
      kind: error.kind,
    };
  }

  return {
    title: "Research request failed",
    message: "Something unexpected happened while running the research flow.",
    kind: "parse",
  };
}

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<UiError | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  async function runResearch(topicOverride?: string) {
    const researchTopic = (topicOverride ?? topic).trim();

    if (!researchTopic) {
      setError({
        title: "Topic required",
        message: "Enter a topic before starting the research run.",
        kind: "parse",
      });
      return;
    }

    setTopic(researchTopic);
    setResult(null);
    setError(null);
    setIsCompleting(false);
    setCurrentStep(0);
    setViewState("loading");

    try {
      let response: ResearchResponse;
      try {
        response = await fetchResearchStream(researchTopic, (step) => {
          setCurrentStep(step);
        });
      } catch (streamErr) {
        if (
          streamErr instanceof ResearchError &&
          (streamErr.kind === "network" || streamErr.status === 500)
        ) {
          throw streamErr;
        }
        response = await fetchResearch(researchTopic);
      }
      setResult(response);
      setIsCompleting(true);

      window.setTimeout(() => {
        setViewState("results");
        setIsCompleting(false);
      }, 650);
    } catch (researchError) {
      setError(toUiError(researchError));
      setViewState("idle");
      setIsCompleting(false);
    }
  }

  function reset() {
    setTopic("");
    setResult(null);
    setError(null);
    setIsCompleting(false);
    setCurrentStep(0);
    setViewState("idle");
  }

  if (viewState === "loading") {
    return (
      <PipelineProgress
        currentStep={currentStep}
        forceComplete={isCompleting}
        topic={topic}
      />
    );
  }

  if (viewState === "results" && result) {
    return <ResultsView result={result} onReset={reset} />;
  }

  return (
    <TopicInput
      errorMessage={error?.message ?? null}
      errorTitle={error?.title ?? null}
      onRetry={() => runResearch(topic)}
      onSubmit={() => runResearch()}
      onTopicChange={(nextTopic) => {
        setTopic(nextTopic);
        if (error) {
          setError(null);
        }
      }}
      topic={topic}
    />
  );
}
