import Link from "next/link";
import { analyzeUsername } from "@/lib/analyze";
import { BracketHeatmap } from "@/components/BracketHeatmap";
import { BracketScoreChart } from "@/components/BracketScoreChart";
import { BracketSummary } from "@/components/BracketSummary";
import { DiagnosticsTable } from "@/components/DiagnosticsTable";
import { SplinterBreakdown } from "@/components/SplinterBreakdown";
import { UpgradeSuggestions } from "@/components/UpgradeSuggestions";

export default async function AnalyzePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  try {
    const result = await analyzeUsername(username);

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <div>
          <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
            ← Back to search
          </Link>
        </div>
        <BracketSummary result={result} />
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <BracketHeatmap result={result} />
          <BracketScoreChart result={result} />
        </div>
        <DiagnosticsTable result={result} />
        <SplinterBreakdown result={result} />
        <UpgradeSuggestions result={result} />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-rose-300">Analysis failed</p>
          <h1 className="mt-3 text-3xl font-bold">Couldn’t analyze @{username}</h1>
          <p className="mt-4 text-textSoft">{message}</p>
          <Link href="/" className="mt-6 inline-block text-cyan-300 hover:text-cyan-200">
            Try another username
          </Link>
        </div>
      </main>
    );
  }
}
