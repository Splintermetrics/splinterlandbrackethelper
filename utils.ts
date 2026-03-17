import { BRACKET_LABELS } from "@/data/weights";
import type { AnalyzeResponse } from "@/types/api";

export function BracketSummary({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="rounded-3xl border border-line bg-panel p-6 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-textSoft">Analysis for</p>
          <h1 className="text-3xl font-bold">@{result.username}</h1>
        </div>
        <div className="rounded-2xl bg-emerald-500/15 px-4 py-3 text-emerald-300">
          <p className="text-xs uppercase tracking-wide">Best bracket</p>
          <p className="text-2xl font-semibold">{BRACKET_LABELS[result.bestBracket]}</p>
        </div>
      </div>
      <p className="mt-4 text-textSoft">{result.summary}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-panelSoft p-4">
          <p className="text-sm text-textSoft">Confidence</p>
          <p className="mt-1 text-2xl font-semibold">{result.confidence}%</p>
        </div>
        <div className="rounded-2xl border border-line bg-panelSoft p-4">
          <p className="text-sm text-textSoft">Fetched cards</p>
          <p className="mt-1 text-2xl font-semibold">{result.totals.fetchedCards}</p>
        </div>
        <div className="rounded-2xl border border-line bg-panelSoft p-4">
          <p className="text-sm text-textSoft">Modern uniques</p>
          <p className="mt-1 text-2xl font-semibold">{result.totals.modernCards}</p>
        </div>
      </div>
    </section>
  );
}
