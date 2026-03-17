import type { AnalyzeResponse } from "@/types/api";
import { BRACKET_ORDER } from "@/data/brackets";

export function BracketScoreChart({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="p-6 border rounded-xl">
      <h2 className="text-lg font-bold mb-4">Bracket Scores</h2>

      <div>
        {BRACKET_ORDER.map((bracket) => (
          <div key={bracket} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{bracket}</span>
              <span>{result.bracketScores[bracket]}</span>
            </div>
            <div
              style={{
                background: "#1f2937",
                height: "10px",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${result.bracketScores[bracket]}%`,
                  background: "#3b82f6",
                  height: "100%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
