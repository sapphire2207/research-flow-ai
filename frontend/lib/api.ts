import type { ResearchRequest, ResearchResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export type ResearchErrorKind = "network" | "http" | "parse";

export class ResearchError extends Error {
  readonly kind: ResearchErrorKind;
  readonly status?: number;

  constructor(message: string, kind: ResearchErrorKind, status?: number) {
    super(message);
    this.name = "ResearchError";
    this.kind = kind;
    this.status = status;
  }
}

function isResearchResponse(value: unknown): value is ResearchResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.topic === "string" &&
    typeof candidate.search_results === "string" &&
    typeof candidate.scraped_content === "string" &&
    typeof candidate.report === "string" &&
    typeof candidate.feedback === "string"
  );
}

export async function fetchResearchStream(
  topic: string,
  onStepChange?: (step: number) => void,
): Promise<ResearchResponse> {
  const requestBody: ResearchRequest = { topic };

  let response: Response;

  try {
    response = await fetch(`${API_BASE}/research/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    throw new ResearchError(
      "Can't reach the ResearchFlow AI backend. Make sure FastAPI is running on 127.0.0.1:8000.",
      "network",
    );
  }

  if (!response.ok) {
    let detail = response.statusText;

    try {
      const text = await response.text();
      detail = text.trim() || detail;
    } catch {
      detail = response.statusText;
    }

    throw new ResearchError(
      `Research request failed (${response.status}): ${detail}`,
      "http",
      response.status,
    );
  }

  if (!response.body) {
    throw new ResearchError("No response body received from server.", "parse");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: ResearchResponse | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const jsonStr = trimmed.replace(/^data:\s*/, "");
      try {
        const payload = JSON.parse(jsonStr);

        if (payload.type === "error") {
          throw new ResearchError(
            payload.message || "Research request failed",
            "http",
          );
        }

        if (payload.type === "step" && typeof payload.step === "number") {
          onStepChange?.(payload.step);
        }

        if (payload.type === "complete" && payload.result) {
          if (isResearchResponse(payload.result)) {
            finalResult = payload.result;
          }
        }
      } catch (e) {
        if (e instanceof ResearchError) {
          throw e;
        }
      }
    }
  }

  if (!finalResult) {
    throw new ResearchError(
      "The backend response did not match the expected ResearchFlow AI contract.",
      "parse",
    );
  }

  return finalResult;
}

export async function fetchResearch(
  topic: string,
): Promise<ResearchResponse> {
  const requestBody: ResearchRequest = { topic };

  let response: Response;

  try {
    response = await fetch(`${API_BASE}/research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    throw new ResearchError(
      "Can't reach the ResearchFlow AI backend. Make sure FastAPI is running on 127.0.0.1:8000.",
      "network",
    );
  }

  if (!response.ok) {
    let detail = response.statusText;

    try {
      const text = await response.text();
      detail = text.trim() || detail;
    } catch {
      detail = response.statusText;
    }

    throw new ResearchError(
      `Research request failed (${response.status}): ${detail}`,
      "http",
      response.status,
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new ResearchError(
      "The backend returned a response that was not valid JSON.",
      "parse",
    );
  }

  if (!isResearchResponse(payload)) {
    throw new ResearchError(
      "The backend response did not match the expected ResearchFlow AI contract.",
      "parse",
    );
  }

  return payload;
}
