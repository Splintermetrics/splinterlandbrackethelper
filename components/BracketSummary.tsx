import type { AnalyzeResponse } from "@/types/api";

export function BracketSummary({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="p-6 border rounded-xl">
      <h2 className="text-lg font-bold mb-4">Summary</h2>
      <p>
        <strong>Best bracket:</strong> {result.bestBracket}
      </p>
      <p>
        <strong>Confidence:</strong> {result.confidence}%
      </p>
    </section>
  );
}
