import type { Bracket, Splinter } from "./brackets";

export type HeatmapRow = {
  splinter: Splinter;
  scores: Record<Bracket, number>;
};

export type BracketDiagnostics = {
  usable: number;
  scaled: number;
  excluded: number;
};

export type SplinterInsight = {
  splinter: Splinter;
  bestBracket: Bracket;
  score: number;
  summary: string;
  usableCards: number;
};

export type AnalyzeResponse = {
  username: string;
  bestBracket: Bracket;
  confidence: number;
  bracketScores: Record<Bracket, number>;
  heatmap: HeatmapRow[];
  diagnostics: Record<Bracket, BracketDiagnostics>;
  splinterInsights: SplinterInsight[];
  assumptions: string[];
  recommendations: string[];
};
