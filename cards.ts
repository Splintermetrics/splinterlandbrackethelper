export type Rarity = "common" | "rare" | "epic" | "legendary";
export type Splinter = "fire" | "water" | "earth" | "life" | "death" | "dragon" | "neutral";
export type Bracket = "novice" | "bronze" | "silver" | "gold" | "diamond" | "champ";

export type LevelBand = {
  min: number;
  max: number;
};

export type BracketRule = Record<Rarity, LevelBand>;
