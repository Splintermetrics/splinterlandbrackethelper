import type { AnalyzeResponse } from "@/types/api";

export function SplinterBreakdown({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="p-6 border rounded-xl">
      <h2 className="text-lg font-bold mb-4">Splinter Breakdown</h2>

      <div style={{ display: "grid", gap: "12px" }}>
        {result.splinterInsights.map((insight) => (
          <article
            key={insight.splinter}
            style={{ border: "1px solid #374151", borderRadius: "12px", padding: "12px" }}
          >
            <h3 style={{ margin: 0, textTransform: "capitalize" }}>
              {insight.splinter}
            </h3>
            <p style={{ margin: "8px 0 4px" }}>
              <strong>Best bracket:</strong> {insight.bestBracket}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Score:</strong> {insight.score}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Usable cards:</strong> {insight.usableCards}
            </p>
            <p style={{ margin: "8px 0 0" }}>{insight.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
