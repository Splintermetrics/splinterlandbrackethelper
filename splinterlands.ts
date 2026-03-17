import type { AnalyzeResponse } from "@/types/api";

export function UpgradeSuggestions({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="rounded-3xl border border-line bg-panel p-6">
      <h2 className="text-xl font-semibold">Upgrade suggestions</h2>
      <ul className="mt-5 space-y-3">
        {result.recommendations.map((recommendation) => (
          <li key={recommendation} className="rounded-2xl border border-line bg-panelSoft p-4 text-sm text-slate-200">
            {recommendation}
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        <p className="font-semibold">Current assumptions</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {result.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
