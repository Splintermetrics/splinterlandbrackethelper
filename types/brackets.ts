export type Bracket =
  | "Novice"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Diamond"
  | "Champ";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type Splinter =
  | "fire"
  | "water"
  | "earth"
  | "life"
  | "death"
  | "dragon"
  | "neutral";

export type LevelBand = {
  min: number;
  max: number;
};

export type BracketRule = {
  common: LevelBand;
  rare: LevelBand;
  epic: LevelBand;
  legendary: LevelBand;
};
