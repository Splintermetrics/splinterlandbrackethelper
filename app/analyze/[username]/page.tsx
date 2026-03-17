import { analyzeUsername } from "@/lib/analyze";
import { BracketHeatmap } from "@/components/BracketHeatmap";
import { BracketScoreChart } from "@/components/BracketScoreChart";
import { BracketSummary } from "@/components/BracketSummary";
import { DiagnosticsTable } from "@/components/DiagnosticsTable";
import { SplinterBreakdown } from "@/components/SplinterBreakdown";
import { UpgradeSuggestions } from "@/components/UpgradeSuggestions";

type AnalyzeUserPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function AnalyzeUserPage({
  params,
}: AnalyzeUserPageProps) {
  const { username } = await params;
  const result = await analyzeUsername(username);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <div style={{ display: "grid", gap: "24px" }}>
        <BracketSummary result={result} />
        <BracketScoreChart result={result} />
        <BracketHeatmap result={result} />
        <DiagnosticsTable result={result} />
        <SplinterBreakdown result={result} />
        <UpgradeSuggestions result={result} />
      </div>
    </main>
  );
}
