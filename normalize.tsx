import { BRACKET_LABELS } from "@/data/weights";
import type { AnalyzeResponse } from "@/types/api";

export function SplinterBreakdown({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="rounded-3xl border border-line bg-panel p-6">
      <h2 className="text-xl font-semibold">Splinter breakdown</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {result.splinterInsights.map((insight) => (
          <article key={insight.splinter} className="rounded-2xl border border-line bg-panelSoft p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">{insight.splinter}</h3>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-textSoft">{BRACKET_LABELS[insight.bestBracket]}</span>
            </div>
            <p className="mt-3 text-sm text-textSoft">{insight.summary}</p>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <p className="text-textSoft">Score</p>
                <p className="font-semibold">{insight.score}</p>
              </div>
              <div>
                <p className="text-textSoft">Usable cards</p>
                <p className="font-semibold">{insight.usableCards}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
