import type { AnalyzeResponse } from "@/types/api";

export function UpgradeSuggestions({ result }: { result: AnalyzeResponse }) {
  return (
    <section className="p-6 border rounded-xl">
      <h2 className="text-lg font-bold mb-4">Upgrade Suggestions</h2>

      <ul>
        {result.recommendations.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
