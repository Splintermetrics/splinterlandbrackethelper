import type { AnalyzeResponse } from "@/types/api";
import type { Bracket, Rarity, Splinter } from "@/types/brackets";

type RawCollectionCard = {
  card_detail_id: number;
  level?: number;
  card_level?: number;
  delegated_to?: string | null;
  xp?: number;
  alpha_xp?: number;
};

type RawCardDetail = {
  id: number;
  name?: string;
  color?: string;
  rarity?: number | string;
  type?: string;
};

type NormalizedCard = {
  cardDetailId: number;
  name: string;
  level: number;
  rarity: Rarity;
  splinter: Splinter;
};

const BRACKET_ORDER: Bracket[] = [
  "Novice",
  "Bronze",
  "Silver",
  "Gold",
  "Diamond",
  "Champ",
];

const SPLINTER_ORDER: Splinter[] = [
  "fire",
  "water",
  "earth",
  "life",
  "death",
  "dragon",
  "neutral",
];

const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 1.0,
  rare: 1.15,
  epic: 1.3,
  legendary: 1.5,
};

const BRACKET_RULES: Record<
  Bracket,
  Record<Rarity, { min: number; max: number }>
> = {
  Novice: {
    common: { min: 1, max: 1 },
    rare: { min: 1, max: 1 },
    epic: { min: 1, max: 1 },
    legendary: { min: 1, max: 1 },
  },
  Bronze: {
    common: { min: 1, max: 3 },
    rare: { min: 1, max: 3 },
    epic: { min: 1, max: 2 },
    legendary: { min: 1, max: 1 },
  },
  Silver: {
    common: { min: 2, max: 5 },
    rare: { min: 1, max: 4 },
    epic: { min: 1, max: 3 },
    legendary: { min: 1, max: 2 },
  },
  Gold: {
    common: { min: 4, max: 8 },
    rare: { min: 3, max: 7 },
    epic: { min: 2, max: 5 },
    legendary: { min: 2, max: 3 },
  },
  Diamond: {
    common: { min: 6, max: 10 },
    rare: { min: 5, max: 8 },
    epic: { min: 4, max: 6 },
    legendary: { min: 2, max: 4 },
  },
  Champ: {
    common: { min: 8, max: 10 },
    rare: { min: 6, max: 8 },
    epic: { min: 5, max: 6 },
    legendary: { min: 3, max: 4 },
  },
};

function normalizeSplinter(color?: string): Splinter {
  const value = (color || "").toLowerCase();

  if (value === "red" || value === "fire") return "fire";
  if (value === "blue" || value === "water") return "water";
  if (value === "green" || value === "earth") return "earth";
  if (value === "white" || value === "life") return "life";
  if (value === "black" || value === "death") return "death";
  if (value === "gold" || value === "dragon") return "dragon";
  return "neutral";
}

function normalizeRarity(rarity?: number | string): Rarity {
  if (rarity === 1 || rarity === "1" || rarity === "common") return "common";
  if (rarity === 2 || rarity === "2" || rarity === "rare") return "rare";
  if (rarity === 3 || rarity === "3" || rarity === "epic") return "epic";
  return "legendary";
}

function getCardLevel(card: RawCollectionCard): number {
  if (typeof card.level === "number" && card.level > 0) return card.level;
  if (typeof card.card_level === "number" && card.card_level > 0) {
    return card.card_level;
  }

  // Fallback for now. Next upgrade can derive level from BCX/XP.
  return 1;
}

function emptyResponse(username: string): AnalyzeResponse {
  return {
    username,
    bestBracket: "Novice",
    confidence: 0,
    bracketScores: {
      Novice: 0,
      Bronze: 0,
      Silver: 0,
      Gold: 0,
      Diamond: 0,
      Champ: 0,
    },
    heatmap: SPLINTER_ORDER.map((splinter) => ({
      splinter,
      scores: {
        Novice: 0,
        Bronze: 0,
        Silver: 0,
        Gold: 0,
        Diamond: 0,
        Champ: 0,
      },
    })),
    diagnostics: {
      Novice: { usable: 0, scaled: 0, excluded: 0 },
      Bronze: { usable: 0, scaled: 0, excluded: 0 },
      Silver: { usable: 0, scaled: 0, excluded: 0 },
      Gold: { usable: 0, scaled: 0, excluded: 0 },
      Diamond: { usable: 0, scaled: 0, excluded: 0 },
      Champ: { usable: 0, scaled: 0, excluded: 0 },
    },
    splinterInsights: [],
    recommendations: ["No cards found for this player."],
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function getNextBracket(bracket: Bracket): Bracket | null {
  if (bracket === "Novice") return "Bronze";
  if (bracket === "Bronze") return "Silver";
  if (bracket === "Silver") return "Gold";
  if (bracket === "Gold") return "Diamond";
  if (bracket === "Diamond") return "Champ";
  return null;
}

export async function analyzeUsername(
  username: string
): Promise<AnalyzeResponse> {
  const collectionRes = await fetch(
    `https://api2.splinterlands.com/cards/collection/${encodeURIComponent(
      username
    )}`,
    { cache: "no-store" }
  );

  if (!collectionRes.ok) {
    throw new Error("Failed to fetch collection");
  }

  const collectionJson = await collectionRes.json();
  const rawCards: RawCollectionCard[] = Array.isArray(collectionJson)
    ? collectionJson
    : Array.isArray(collectionJson.cards)
      ? collectionJson.cards
      : [];

  const detailsRes = await fetch(
    "https://api2.splinterlands.com/cards/get_details",
    {
      next: { revalidate: 3600 },
    }
  );

  if (!detailsRes.ok) {
    throw new Error("Failed to fetch card details");
  }

  const detailsJson = await detailsRes.json();
  const rawDetails: RawCardDetail[] = Array.isArray(detailsJson)
    ? detailsJson
    : Array.isArray(detailsJson.cards)
      ? detailsJson.cards
      : [];

  const detailById = new Map<number, RawCardDetail>();
  for (const detail of rawDetails) {
    if (typeof detail.id === "number") {
      detailById.set(detail.id, detail);
    }
  }

  // Highest-level copy only
  const bestByCard = new Map<number, NormalizedCard>();

  for (const rawCard of rawCards) {
    const detail = detailById.get(rawCard.card_detail_id);
    if (!detail) continue;

    const normalized: NormalizedCard = {
      cardDetailId: rawCard.card_detail_id,
      name: detail.name || `Card ${rawCard.card_detail_id}`,
      level: getCardLevel(rawCard),
      rarity: normalizeRarity(detail.rarity),
      splinter: normalizeSplinter(detail.color),
    };

    const existing = bestByCard.get(normalized.cardDetailId);
    if (!existing || normalized.level > existing.level) {
      bestByCard.set(normalized.cardDetailId, normalized);
    }
  }

  const cards = Array.from(bestByCard.values());

  if (cards.length === 0) {
    return emptyResponse(username);
  }

  const diagnostics: AnalyzeResponse["diagnostics"] = {
    Novice: { usable: 0, scaled: 0, excluded: 0 },
    Bronze: { usable: 0, scaled: 0, excluded: 0 },
    Silver: { usable: 0, scaled: 0, excluded: 0 },
    Gold: { usable: 0, scaled: 0, excluded: 0 },
    Diamond: { usable: 0, scaled: 0, excluded: 0 },
    Champ: { usable: 0, scaled: 0, excluded: 0 },
  };

  const bracketScoresRaw: Record<Bracket, number> = {
    Novice: 0,
    Bronze: 0,
    Silver: 0,
    Gold: 0,
    Diamond: 0,
    Champ: 0,
  };

  const heatmapRaw: Record<Splinter, Record<Bracket, number>> = {
    fire: { Novice: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0, Champ: 0 },
    water: { Novice: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0, Champ: 0 },
    earth: { Novice: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0, Champ: 0 },
    life: { Novice: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0, Champ: 0 },
    death: { Novice: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0, Champ: 0 },
    dragon: { Novice: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0, Champ: 0 },
    neutral: { Novice: 0, Bronze: 0, Silver: 0, Gold: 0, Diamond: 0, Champ: 0 },
  };

  for (const bracket of BRACKET_ORDER) {
    for (const card of cards) {
      const rule = BRACKET_RULES[bracket][card.rarity];

      // Underlevelled = excluded
      if (card.level < rule.min) {
        diagnostics[bracket].excluded += 1;
        continue;
      }

      const effectiveLevel = Math.min(card.level, rule.max);
      const isScaled = card.level > rule.max;

      if (isScaled) {
        diagnostics[bracket].scaled += 1;
      } else {
        diagnostics[bracket].usable += 1;
      }

      // Cards at top of the bracket score more.
      // Scaled cards count as max-level in the bracket.
      const normalizedBandScore =
        (effectiveLevel - rule.min + 1) / (rule.max - rule.min + 1);

      const weightedScore = normalizedBandScore * RARITY_WEIGHTS[card.rarity];

      bracketScoresRaw[bracket] += weightedScore;
      heatmapRaw[card.splinter][bracket] += weightedScore;
    }
  }

  const bracketScores: Record<Bracket, number> = {
    Novice: Math.round(bracketScoresRaw.Novice),
    Bronze: Math.round(bracketScoresRaw.Bronze),
    Silver: Math.round(bracketScoresRaw.Silver),
    Gold: Math.round(bracketScoresRaw.Gold),
    Diamond: Math.round(bracketScoresRaw.Diamond),
    Champ: Math.round(bracketScoresRaw.Champ),
  };

  const bestBracket = BRACKET_ORDER.reduce((best, current) =>
    bracketScores[current] > bracketScores[best] ? current : best
  , "Bronze" as Bracket);

  const bestScore = bracketScoresRaw[bestBracket];
  const theoreticalMax = cards.reduce((sum, card) => {
    return sum + RARITY_WEIGHTS[card.rarity];
  }, 0);

  const confidence = Math.max(
    1,
    Math.min(
      99,
      Math.round((bestScore / Math.max(theoreticalMax, 1)) * 100)
    )
  );

  const heatmap = SPLINTER_ORDER.map((splinter) => ({
    splinter,
    scores: {
      Novice: Math.round(heatmapRaw[splinter].Novice),
      Bronze: Math.round(heatmapRaw[splinter].Bronze),
      Silver: Math.round(heatmapRaw[splinter].Silver),
      Gold: Math.round(heatmapRaw[splinter].Gold),
      Diamond: Math.round(heatmapRaw[splinter].Diamond),
      Champ: Math.round(heatmapRaw[splinter].Champ),
    },
  }));

  const splinterInsights = SPLINTER_ORDER
    .map((splinter) => {
      const bestSplinterBracket = BRACKET_ORDER.reduce((best, current) =>
        heatmapRaw[splinter][current] > heatmapRaw[splinter][best]
          ? current
          : best
      , "Bronze" as Bracket);

      const usableCards = cards.filter((card) => {
        if (card.splinter !== splinter) return false;
        const rule = BRACKET_RULES[bestSplinterBracket][card.rarity];
        return card.level >= rule.min;
      }).length;

      return {
        splinter,
        bestBracket: bestSplinterBracket,
        score: Math.round(heatmapRaw[splinter][bestSplinterBracket]),
        usableCards,
        summary:
          usableCards > 0
            ? `${usableCards} cards can play in ${bestSplinterBracket}, with stronger cards scoring higher inside that bracket.`
            : `No playable cards currently qualify for ${bestSplinterBracket}.`,
      };
    })
    .filter((item) => item.usableCards > 0)
    .sort((a, b) => b.score - a.score);

  const nextBracket = getNextBracket(bestBracket);

  const recommendations = [
    `Best current bracket by level-weighted card strength: ${bestBracket}.`,
    nextBracket
      ? `${diagnostics[nextBracket].excluded} cards are still below the minimum for ${nextBracket}.`
      : "You are already at the highest bracket tier.",
    diagnostics[bestBracket].scaled > 0
      ? `${diagnostics[bestBracket].scaled} of your cards are above the ${bestBracket} cap and are scoring as max-level cards in that bracket.`
      : `Most of your ${bestBracket} cards are scoring based on their natural level within the bracket range.`,
    splinterInsights.length > 0
      ? `${splinterInsights[0].splinter} is currently one of your stronger splinters for bracket play.`
      : "No splinter insights are available yet.",
  ];

  return {
    username,
    bestBracket,
    confidence,
    bracketScores,
    heatmap,
    diagnostics,
    splinterInsights,
    recommendations,
  };
}
