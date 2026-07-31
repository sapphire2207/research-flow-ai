interface ScoreBadgeProps {
  feedback: string;
}

function extractScore(feedback: string) {
  const match = feedback.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);

  if (!match) {
    return null;
  }

  const score = Number.parseFloat(match[1]);

  if (!Number.isFinite(score)) {
    return null;
  }

  return Math.max(0, Math.min(10, score));
}

export function ScoreBadge({ feedback }: ScoreBadgeProps) {
  const score = extractScore(feedback);

  if (score === null) {
    return null;
  }

  const percentage = Math.round(score * 10);

  return (
    <div className="mb-6 flex flex-col gap-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5 sm:flex-row sm:items-center">
      <div
        className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#22d3ee ${percentage}%, rgba(255,255,255,0.1) 0)`,
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#10141d]">
          <div className="text-center">
            <p className="text-3xl font-semibold text-white">{score}</p>
            <p className="text-xs text-slate-400">/10</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium uppercase text-cyan-100">
          Critic score
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
          The critic agent scored this report before returning strengths, gaps,
          and a one-line verdict.
        </p>
      </div>
    </div>
  );
}
