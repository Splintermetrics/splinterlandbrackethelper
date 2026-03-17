import type { Bracket, BracketRule } from "@/types/brackets";

export const BRACKET_ORDER: Bracket[] = ["novice", "bronze", "silver", "gold", "diamond", "champ"];

export const BRACKETS: Record<Bracket, BracketRule> = {
  novice: {
    common: { min: 1, max: 1 },
    rare: { min: 1, max: 1 },
    epic: { min: 1, max: 1 },
    legendary: { min: 1, max: 1 },
  },
  bronze: {
    common: { min: 1, max: 3 },
    rare: { min: 1, max: 3 },
    epic: { min: 1, max: 2 },
    legendary: { min: 1, max: 1 },
  },
  silver: {
    common: { min: 2, max: 5 },
    rare: { min: 1, max: 4 },
    epic: { min: 1, max: 3 },
    legendary: { min: 1, max: 2 },
  },
  gold: {
    common: { min: 4, max: 8 },
    rare: { min: 3, max: 7 },
    epic: { min: 2, max: 5 },
    legendary: { min: 2, max: 3 },
  },
  diamond: {
    common: { min: 6, max: 10 },
    rare: { min: 5, max: 8 },
    epic: { min: 4, max: 6 },
    legendary: { min: 2, max: 4 },
  },
  champ: {
    common: { min: 8, max: 10 },
    rare: { min: 6, max: 8 },
    epic: { min: 5, max: 6 },
    legendary: { min: 3, max: 4 },
  },
};
