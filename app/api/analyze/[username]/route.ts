import { NextResponse } from "next/server";

type Bracket =
  | "Novice"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Diamond"
  | "Champ";

const BRACKET_SCORES: Record<Bracket, number> = {
  Novice: 20,
  Bronze: 35,
  Silver: 55,
  Gold: 78,
  Diamond: 61,
  Champ: 32,
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  const bestBracket = Object.entries(BRACKET_SCORES).sort(
    (a, b) => b[1] - a[1]
  )[0][0] as Bracket;

  return NextResponse.json({
    username,
    analyzedAt: new Date().toISOString(),
    bestBracket,
    confidence: BRACKET_SCORES[bestBracket],
    bracketScores: BRACKET_SCORES,
    recommendations: [
      "Increase Rare and Epic depth to improve higher bracket readiness.",
      "Focus on strongest splinters first when refining bracket fit.",
      "This starter uses placeholder analysis data until live collection parsing is added.",
    ],
  });
}
