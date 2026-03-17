import { BRACKET_LABELS } from "@/data/weights";
import { BRACKET_ORDER } from "@/data/brackets";
import type { AnalyzeResponse } from "@/types/api";

function cellClass(score: number) {
  if (score >= 75) return "bg-emerald-500/30 text-emerald-200";
  if (score >= 55) return "bg-cyan-500/25 text-cyan-100";
  if (score >= 35) return "bg-amber-500/25 text-amber-100";
  return "bg-rose-500/20 text-rose-100";
}

export function BracketHeatmap({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="rounded-3xl border border-line bg-panel p-6">
      <h2 className="text-xl font-semibold">Splinter heatmap</h2>
      <p className="mt-2 text-sm text-textSoft">Rows are splinters, columns are Modern brackets.</p>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-2 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-textSoft">Splinter</th>
              {BRACKET_ORDER.map((bracket) => (
                <th key={bracket} className="px-3 py-2 text-left text-textSoft">
                  {BRACKET_LABELS[bracket]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.heatmap.map((row) => (
              <tr key={row.splinter}>
                <td className="px-3 py-2 font-medium capitalize">{row.splinter}</td>
                {BRACKET_ORDER.map((bracket) => {
                  const score = row.scores[bracket];
                  return (
                    <td key={bracket} className={`rounded-xl px-3 py-3 ${cellClass(score)}`} title={`${row.splinter} / ${BRACKET_LABELS[bracket]}: ${score}`}>
                      {score}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
