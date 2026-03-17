import type { Bracket, Rarity, Splinter } from "@/types/brackets";

export type CardType = "archon" | "monster";

export type RawCollectionCard = {
  uid?: string;
  player?: string;
  card_detail_id?: number | string;
  card_detail_id_alpha?: number | string;
  level?: number | string;
  card_level?: number | string;
  xp?: number | string;
  bcx?: number | string;
  edition?: number | string;
  gold?: boolean | number | string;
  delegated_to?: string | null;
  market_id?: string | null;
};

export type RawCardDetail = {
  id?: number;
  card_detail_id?: number;
  name?: string;
  rarity?: number | string;
  color?: string;
  splinter?: string;
  type?: string;
  editions?: string;
  modern?: boolean;
  format?: string;
  tier?: number | string;
};

export type CardDefinition = {
  cardDetailId: number;
  name: string;
  rarity: Rarity;
  splinter: Splinter;
  type: CardType;
  editionSet?: string;
  isModern: boolean;
};

export type OwnedCard = {
  cardDetailId: number;
  name: string;
  rarity: Rarity;
  splinter: Splinter;
  type: CardType;
  ownedLevel: number;
  isModern: boolean;
  uid?: string;
};

export type EligibleCard = OwnedCard & {
  bracket: Bracket;
  bracketMin: number;
  bracketMax: number;
  effectiveLevel: number;
  normalizedScore: number;
  wasScaledDown: boolean;
};
