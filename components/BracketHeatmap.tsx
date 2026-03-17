import type { AnalyzeResponse } from "@/types/api";
import { BRACKET_ORDER } from "@/data/brackets";

export function BracketHeatmap({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="rounded-3xl border border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4">Splinter Heatmap</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Splinter</th>
              {BRACKET_ORDER.map((b) => (
                <th key={b} className="p-2">
                  {b}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {result.heatmap.map((row) => (
              <tr key={row.splinter} className="border-t border-gray-700">
                <td className="p-2 capitalize">{row.splinter}</td>

                {BRACKET_ORDER.map((b) => (
                  <td key={b} className="p-2 text-center">
                    {row.scores[b]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
