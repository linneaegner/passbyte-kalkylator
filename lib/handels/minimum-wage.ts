import type { WorkArea } from "./types"

/** Minimilön per timme från 1 april 2026 (Handels butik/lager/e-handel). */
export type WageTier =
  | "age16"
  | "age17"
  | "age18"
  | "age19"
  | "exp1"
  | "exp2"
  | "exp3"
  | "custom"

export const WAGE_TIER_LABELS_SV: Record<Exclude<WageTier, "custom">, string> = {
  age16: "16 år",
  age17: "17 år",
  age18: "18 år",
  age19: "19 år",
  exp1: "1 års branschvana (18+)",
  exp2: "2 års branschvana",
  exp3: "3 års branschvana",
}

/** Kr/tim enligt avtal 1 april 2026 — samma tabell för butik, lager och e-handel. */
const MIN_WAGE_APRIL_2026: Record<Exclude<WageTier, "custom">, number> = {
  age16: 104.36,
  age17: 106.83,
  age18: 160.4,
  age19: 162.33,
  exp1: 165.84,
  exp2: 167.87,
  exp3: 175.64,
}

export function getMinimumWage(_workArea: WorkArea, tier: Exclude<WageTier, "custom">): number {
  return MIN_WAGE_APRIL_2026[tier]
}

export function resolveBaseWage(
  workArea: WorkArea,
  tier: WageTier,
  customWage: number,
): number {
  if (tier === "custom") return customWage
  return getMinimumWage(workArea, tier)
}
