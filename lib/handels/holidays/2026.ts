/** Röda dagar och storhelgsaftnar enligt Handels (handels.se, 2026). */
export const publicHolidays2026 = [
  { date: "2026-01-01", name: "Nyårsdagen" },
  { date: "2026-01-06", name: "Trettondedag jul" },
  { date: "2026-04-03", name: "Långfredagen" },
  { date: "2026-04-05", name: "Påskdagen" },
  { date: "2026-04-06", name: "Annandag påsk" },
  { date: "2026-05-01", name: "Första maj" },
  { date: "2026-05-14", name: "Kristi himmelsfärdsdag" },
  { date: "2026-05-24", name: "Pingstdagen" },
  { date: "2026-06-06", name: "Sveriges nationaldag" },
  { date: "2026-06-20", name: "Midsommardagen" },
  { date: "2026-10-31", name: "Alla helgons dag" },
  { date: "2026-12-25", name: "Juldagen" },
  { date: "2026-12-26", name: "Annandag jul" },
] as const

/** Butik: lördag med 100 % ob efter kl. 12. Lager: påskafton = vanlig lördag. */
export const eveDays2026 = [
  { date: "2026-04-04", kind: "Påskafton" as const },
  { date: "2026-06-19", kind: "Midsommarafton" as const },
  { date: "2026-12-24", kind: "Julafton" as const },
  { date: "2026-12-31", kind: "Nyårsafton" as const },
] as const
