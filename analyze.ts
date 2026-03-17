import type { Bracket, Rarity } from "@/types/brackets";

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 1,
  rare: 1.15,
  epic: 1.3,
  legendary: 1.45,
};

export const TYPE_WEIGHTS = {
  archon: 1.75,
  monster: 1,
} as const;

export const SCORE_WEIGHTS = {
  cardPower: 0.45,
  splinterCoverage: 0.2,
  rarityBalance: 0.15,
  archonPresence: 0.1,
  depth: 0.1,
} as const;

export const MODERN_EDITION_ALLOWLIST = new Set<number>([
  7, 8, 9, 10, 11, 12, 13, 14,
]);

export const BRACKET_LABELS: Record<Bracket, string> = {
  novice: "Novice",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  diamond: "Diamond",
  champ: "Champ",
};
