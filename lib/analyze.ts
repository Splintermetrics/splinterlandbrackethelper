import type { AnalyzeResponse } from "@/types/api";

export async function analyzeUsername(
  username: string
): Promise<AnalyzeResponse> {
  return {
    username,
    bestBracket: "Gold",
    confidence: 78,
    bracketScores: {
      Novice: 20,
      Bronze: 35,
      Silver: 55,
      Gold: 78,
      Diamond: 61,
      Champ: 32,
    },
    heatmap: [
      {
        splinter: "fire",
        scores: {
          Novice: 10,
          Bronze: 24,
          Silver: 42,
          Gold: 68,
          Diamond: 38,
          Champ: 12,
        },
      },
      {
        splinter: "water",
        scores: {
          Novice: 14,
          Bronze: 29,
          Silver: 51,
          Gold: 72,
          Diamond: 49,
          Champ: 18,
        },
      },
      {
        splinter: "earth",
        scores: {
          Novice: 12,
          Bronze: 26,
          Silver: 48,
          Gold: 74,
          Diamond: 55,
          Champ: 22,
        },
      },
      {
        splinter: "life",
        scores: {
          Novice: 9,
          Bronze: 21,
          Silver: 39,
          Gold: 57,
          Diamond: 33,
          Champ: 11,
        },
      },
      {
        splinter: "death",
        scores: {
          Novice: 11,
          Bronze: 25,
          Silver: 44,
          Gold: 63,
          Diamond: 41,
          Champ: 16,
        },
      },
      {
        splinter: "dragon",
        scores: {
          Novice: 7,
          Bronze: 18,
          Silver: 36,
          Gold: 52,
          Diamond: 34,
          Champ: 14,
        },
      },
      {
        splinter: "neutral",
        scores: {
          Novice: 13,
          Bronze: 31,
          Silver: 53,
          Gold: 69,
          Diamond: 47,
          Champ: 19,
        },
      },
    ],
    recommendations: [
      "Gold is currently your strongest overall bracket.",
      "Increasing Rare and Epic depth would improve Diamond readiness.",
      "Focus on Earth, Water, and Neutral first for the biggest gains.",
    ],
  };
}
