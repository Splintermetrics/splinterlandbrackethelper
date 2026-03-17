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

  const bracketScores: Record<Bracket, number> = {
    Novice: 0,
    Bronze: 0,
    Silver: 0,
    Gold: 0,
    Diamond: 0,
    Champ: 0,
  };

  const diagnostics: AnalyzeResponse["diagnostics"] = {
    Novice: { usable: 0, scaled: 0, excluded: 0 },
    Bronze: { usable: 0, scaled: 0, excluded: 0 },
    Silver: { usable: 0, scaled: 0, excluded: 0 },
    Gold: { usable: 0, scaled: 0, excluded: 0 },
    Diamond: { usable: 0, scaled: 0, excluded: 0 },
    Champ: { usable: 0, scaled: 0, excluded: 0 },
  };

  const heatmapWeighted: Record<Splinter, Record<Bracket, number>> = {
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

      const normalizedContribution =
        (effectiveLevel - rule.min + 1) / (rule.max - rule.min + 1);

      const weightedContribution = isScaled
        ? normalizedContribution * 0.35
        : normalizedContribution * 1.0;

      heatmapWeighted[card.splinter][bracket] += weightedContribution;
    }

    const usable = diagnostics[bracket].usable;
    const scaled = diagnostics[bracket].scaled;
    const excluded = diagnostics[bracket].excluded;
    const total = usable + scaled + excluded || 1;

    const fitRatio = (usable + scaled * 0.35) / total;
    const weightedCountScore = usable * 1.0 + scaled * 0.35 - excluded * 0.5;

    const finalScore = weightedCountScore * 0.7 + fitRatio * 100 * 0.3;
    bracketScores[bracket] = Math.max(0, Math.round(finalScore));
  }

  const bestBracket = BRACKET_ORDER.reduce((best, current) =>
    bracketScores[current] > bracketScores[best] ? current : best
  , "Bronze" as Bracket);

  const bestDiagnostics = diagnostics[bestBracket];
  const totalRelevant =
    bestDiagnostics.usable +
      bestDiagnostics.scaled +
      bestDiagnostics.excluded || 1;

  const confidence = Math.max(
    1,
    Math.min(
      99,
      Math.round(
        ((bestDiagnostics.usable + bestDiagnostics.scaled * 0.35) /
          totalRelevant) *
          100
      )
    )
  );

  const heatmap = SPLINTER_ORDER.map((splinter) => ({
    splinter,
    scores: {
      Novice: Math.round(heatmapWeighted[splinter].Novice),
      Bronze: Math.round(heatmapWeighted[splinter].Bronze),
      Silver: Math.round(heatmapWeighted[splinter].Silver),
      Gold: Math.round(heatmapWeighted[splinter].Gold),
      Diamond: Math.round(heatmapWeighted[splinter].Diamond),
      Champ: Math.round(heatmapWeighted[splinter].Champ),
    },
  }));

  const splinterInsights = SPLINTER_ORDER
    .map((splinter) => {
      const scores = heatmapWeighted[splinter];

      const bestSplinterBracket = BRACKET_ORDER.reduce((best, current) =>
        scores[current] > scores[best] ? current : best
      , "Bronze" as Bracket);

      const usableCards = cards.filter((card) => {
        if (card.splinter !== splinter) return false;
        const rule = BRACKET_RULES[bestSplinterBracket][card.rarity];
        return card.level >= rule.min;
      }).length;

      return {
        splinter,
        bestBracket: bestSplinterBracket,
        score: Math.round(scores[bestSplinterBracket]),
        usableCards,
        summary:
          usableCards > 0
            ? `${usableCards} cards can play in ${bestSplinterBracket}.`
            : `No playable cards currently qualify for ${bestSplinterBracket}.`,
      };
    })
    .filter((item) => item.usableCards > 0)
    .sort((a, b) => b.score - a.score);

  const nextBracket =
    bestBracket === "Novice"
      ? "Bronze"
      : bestBracket === "Bronze"
        ? "Silver"
        : bestBracket === "Silver"
          ? "Gold"
          : bestBracket === "Gold"
            ? "Diamond"
            : bestBracket === "Diamond"
              ? "Champ"
              : null;

  const recommendations = [
    `Best current bracket by usable-card weighting: ${bestBracket}.`,
    nextBracket
      ? `${diagnostics[nextBracket].excluded} cards are currently below the minimum for ${nextBracket}.`
      : "You are already at the highest bracket tier.",
    diagnostics[bestBracket].scaled > diagnostics[bestBracket].usable
      ? `You are somewhat overlevelled for ${bestBracket}; a higher bracket may suit your collection depth better soon.`
      : `Your ${bestBracket} bracket has more naturally usable cards than scaled cards.`,
    splinterInsights.length > 0
      ? `${splinterInsights[0].splinter} is currently one of your stronger splinters.`
      : "No splinter insights are available yet.",
  ];

  return {
    username,
    bestBracket,
    confidence,
    bracketScores: {
      Novice: Math.round(bracketScores.Novice),
      Bronze: Math.round(bracketScores.Bronze),
      Silver: Math.round(bracketScores.Silver),
      Gold: Math.round(bracketScores.Gold),
      Diamond: Math.round(bracketScores.Diamond),
      Champ: Math.round(bracketScores.Champ),
    },
    heatmap,
    diagnostics: {
      Novice: {
        usable: diagnostics.Novice.usable,
        scaled: diagnostics.Novice.scaled,
        excluded: diagnostics.Novice.excluded,
      },
      Bronze: {
        usable: diagnostics.Bronze.usable,
        scaled: diagnostics.Bronze.scaled,
        excluded: diagnostics.Bronze.excluded,
      },
      Silver: {
        usable: diagnostics.Silver.usable,
        scaled: diagnostics.Silver.scaled,
        excluded: diagnostics.Silver.excluded,
      },
      Gold: {
        usable: diagnostics.Gold.usable,
        scaled: diagnostics.Gold.scaled,
        excluded: diagnostics.Gold.excluded,
      },
      Diamond: {
        usable: diagnostics.Diamond.usable,
        scaled: diagnostics.Diamond.scaled,
        excluded: diagnostics.Diamond.excluded,
      },
      Champ: {
        usable: diagnostics.Champ.usable,
        scaled: diagnostics.Champ.scaled,
        excluded: diagnostics.Champ.excluded,
      },
    },
    splinterInsights,
    recommendations,
  };
}
