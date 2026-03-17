import type { Bracket } from "./brackets";

export type AnalyzeResponse = {
  username: string;
  bestBracket: Bracket;
  confidence: number;
  bracketScores: Record<Bracket, number>;
  recommendations: string[];
};
