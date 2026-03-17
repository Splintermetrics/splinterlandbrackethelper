import type { AnalyzeResponse } from "@/types/api";

type SplinterlandsCard = {
  card_detail_id: number;
  level: number;
  rarity: number;
  delegated_to?: string | null;
};

export async function analyzeUsername(
  username: string
): Promise<AnalyzeResponse> {
  const res = await fetch(
    `https://api2.splinterlands.com/cards/collection/${username}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch collection");
  }

  const data = await res.json();

  const cards: SplinterlandsCard[] = data.cards || [];

  // 🔥 Step 3 — Basic parsing (v1 logic)
  const totalCards = cards.length;

  const rarityCounts = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };

  cards.forEach((card) => {
    if (card.rarity === 1) rarityCounts.common++;
    if (card.rarity === 2) rarityCounts.rare++;
    if (card.rarity === 3) rarityCounts.epic++;
    if (card.rarity === 4) rarityCounts.legendary++;
  });

  // 👉 placeholder scoring (we improve next)
  const score =
    rarityCounts.common +
    rarityCounts.rare * 2 +
    rarityCounts.epic * 4 +
    rarityCounts.legendary * 8;

  // 🔥 Simple bracket guess (temporary logic)
  let bestBracket: AnalyzeResponse["bestBracket"] = "Bronze";

  if (score > 500) bestBracket = "Gold";
  if (score > 1000) bestBracket = "Diamond";
  if (score > 2000) bestBracket = "Champ";

  return {
    username,
    bestBracket,
    confidence: Math.min(90, Math.floor(score / 20)),
    bracketScores: {
      Novice: 20,
      Bronze: 40,
      Silver: 60,
      Gold: 75,
      Diamond: 65,
      Champ: 30,
    },
    heatmap: [],
    diagnostics: {
      Novice: { usable: 0, scaled: 0, excluded: 0 },
      Bronze: { usable: totalCards, scaled: 0, excluded: 0 },
      Silver: { usable: Math.floor(totalCards * 0.8), scaled: 0, excluded: 0 },
      Gold: { usable: Math.floor(totalCards * 0.6), scaled: 0, excluded: 0 },
      Diamond: { usable: Math.floor(totalCards * 0.4), scaled: 0, excluded: 0 },
      Champ: { usable: Math.floor(totalCards * 0.2), scaled: 0, excluded: 0 },
    },
    splinterInsights: [],
    recommendations: [
      "Upgrade rare and epic cards to improve higher bracket viability.",
    ],
    assumptions: [
      "This is an early scoring model based on rarity counts.",
      "Card levels and summoners not yet fully considered.",
    ],
  };
}
