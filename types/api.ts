import type { Bracket, Splinter } from "./brackets";

export type HeatmapRow = {
  splinter: Splinter;
  scores: Record<Bracket, number>;
};

export type AnalyzeResponse = {
  username: string;
  bestBracket: Bracket;
  confidence: number;
  bracketScores: Record<Bracket, number>;
  heatmap: HeatmapRow[];
  recommendations: string[];
};
