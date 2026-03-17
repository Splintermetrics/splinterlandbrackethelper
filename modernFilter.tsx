import { BRACKET_ORDER } from "@/data/brackets";
import { BRACKET_LABELS } from "@/data/weights";
import type { AnalyzeResponse } from "@/types/api";

export function DiagnosticsTable({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="rounded-3xl border border-line bg-panel p-6">
      <h2 className="text-xl font-semibold">Bracket eligibility breakdown</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-line text-textSoft">
              <th className="px-3 py-2 text-left">Bracket</th>
              <th className="px-3 py-2 text-left">Usable</th>
              <th className="px-3 py-2 text-left">Scaled</th>
              <th className="px-3 py-2 text-left">Excluded</th>
            </tr>
          </thead>
          <tbody>
            {BRACKET_ORDER.map((bracket) => {
              const item = result.diagnostics[bracket];
              return (
                <tr key={bracket} className="border-b border-line/60">
                  <td className="px-3 py-3">{BRACKET_LABELS[bracket]}</td>
                  <td className="px-3 py-3">{item.usable}</td>
                  <td className="px-3 py-3">{item.scaled}</td>
                  <td className="px-3 py-3">{item.excluded}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
