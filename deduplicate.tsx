import { BRACKET_LABELS } from "@/data/weights";
import { BRACKET_ORDER } from "@/data/brackets";
import type { AnalyzeResponse } from "@/types/api";

export function BracketScoreChart({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="rounded-3xl border border-line bg-panel p-6">
      <h2 className="text-xl font-semibold">Overall bracket scores</h2>
      <div className="mt-5 space-y-4">
        {BRACKET_ORDER.map((bracket) => {
          const score = result.bracketScores[bracket];
          return (
            <div key={bracket}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{BRACKET_LABELS[bracket]}</span>
                <span className="text-textSoft">{score}</span>
              </div>
              <div className="h-3 rounded-full bg-panelSoft">
                <div className="h-3 rounded-full bg-cyan-400" style={{ width: `${Math.max(score, 3)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
