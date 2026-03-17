import type { AnalyzeResponse } from "@/types/api";
import { BRACKET_ORDER } from "@/data/brackets";

export function DiagnosticsTable({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="p-6 border rounded-xl">
      <h2 className="text-lg font-bold mb-4">Diagnostics</h2>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Bracket</th>
            <th>Usable</th>
            <th>Scaled</th>
            <th>Excluded</th>
          </tr>
        </thead>
        <tbody>
          {BRACKET_ORDER.map((bracket) => {
            const item = result.diagnostics[bracket];
            return (
              <tr key={bracket}>
                <td>{bracket}</td>
                <td>{item.usable}</td>
                <td>{item.scaled}</td>
                <td>{item.excluded}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
