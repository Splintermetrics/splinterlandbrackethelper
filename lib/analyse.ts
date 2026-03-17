export async function analyzeUsername(username: string) {
  // TEMP mock data so the app builds
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
    recommendations: [
      "Increase Rare and Epic depth",
      "Focus on strongest splinters",
      "Replace mock data with real API soon",
    ],
  };
}
