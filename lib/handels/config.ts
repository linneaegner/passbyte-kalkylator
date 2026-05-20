/** Handels avtal butik, lager och e-handel — gäller från 1 april 2025, lönehöjning 1 april 2026. */
export const AGREEMENT_YEAR = 2026

export const SUPPORTED_HOLIDAY_YEARS = [2026] as const

/** Lönehöjning från 1 april 2026 (kr/tim, enligt Handels). */
export const WAGE_INCREASE_APRIL_2026 = {
  butik: 5.75,
  lager: 5.32,
} as const
