import type { Bracket, Splinter } from "./brackets";

export type HeatmapRow = {
  splinter: Splinter;
  scores: Record<Bracket, number>;
};

export type BracketDiagnostics = {
  eligible: boolean;
  reason?: string;
};

export type AnalyzeResponse = {
  username: string;
  bestBracket: Bracket;
  confidence: number;
  bracketScores: Record<Bracket, number>;
  heatmap: HeatmapRow[];
  diagnostics: Record<Bracket, BracketDiagnostics>; // 👈 ADD THIS
  recommendations: string[];
};
