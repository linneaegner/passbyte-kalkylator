import type { WorkArea } from "./types"

/** Minimilön per timme från 1 april 2026 (Handels butik/lager/e-handel). */
export type ButikWageTier = "age16" | "age17" | "age18" | "age19" | "exp1" | "exp2" | "exp3"
export type LagerWageTier = "age16" | "age17" | "age18" | "age19" | "age20" | "exp6m"
export type WageTier = ButikWageTier | LagerWageTier | "custom"

export const WAGE_TIER_LABELS_SV: Record<Exclude<WageTier, "custom">, string> = {
  age16: "16 år",
  age17: "17 år",
  age18: "18 år",
  age19: "19 år",
  age20: "20 år",
  exp1: "1 års branschvana (18+)",
  exp2: "2 års branschvana",
  exp3: "3 års branschvana",
  exp6m: "+6 mån branschvana",
}

const MIN_WAGE_BUTIK_APRIL_2026: Record<ButikWageTier, number> = {
  age16: 104.36,
  age17: 106.83,
  age18: 160.4,
  age19: 162.33,
  exp1: 165.84,
  exp2: 167.87,
  exp3: 175.64,
}

const MIN_WAGE_LAGER_APRIL_2026: Record<LagerWageTier, number> = {
  age16: 105.55,
  age17: 111.55,
  age18: 163.73,
  age19: 166.85,
  age20: 167.75,
  exp6m: 170.86,
}

const BUTIK_WAGE_TIERS: ButikWageTier[] = ["age16", "age17", "age18", "age19", "exp1", "exp2", "exp3"]
const LAGER_WAGE_TIERS: LagerWageTier[] = ["age16", "age17", "age18", "age19", "age20", "exp6m"]

export function getWageTiersForWorkArea(workArea: WorkArea): Exclude<WageTier, "custom">[] {
  return workArea === "Butik" ? BUTIK_WAGE_TIERS : LAGER_WAGE_TIERS
}

export function isWageTierValidForWorkArea(workArea: WorkArea, tier: WageTier): boolean {
  if (tier === "custom") return true
  return getWageTiersForWorkArea(workArea).includes(tier)
}

export function getMinimumWage(workArea: WorkArea, tier: Exclude<WageTier, "custom">): number {
  if (workArea === "Butik") {
    return MIN_WAGE_BUTIK_APRIL_2026[tier as ButikWageTier]
  }
  return MIN_WAGE_LAGER_APRIL_2026[tier as LagerWageTier]
}

export function resolveBaseWage(
  workArea: WorkArea,
  tier: WageTier,
  customWage: number,
): number {
  if (tier === "custom") return customWage
  return getMinimumWage(workArea, tier)
}
