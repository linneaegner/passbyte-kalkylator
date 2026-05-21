export function formatSek(amount: number, locale = "sv-SE"): string {
  return `${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`
}

export function formatSignedSek(amount: number, locale = "sv-SE"): string {
  const prefix = amount > 0 ? "+" : ""
  return `${prefix}${formatSek(amount, locale)}`
}

export function formatHoursDuration(hours: number, language: "sv" | "en"): string {
  const abs = Math.round(Math.abs(hours) * 10) / 10
  const locale = language === "sv" ? "sv-SE" : "en-US"
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(abs)
  const unit =
    language === "sv" ? (abs === 1 ? "timme" : "timmar") : abs === 1 ? "hour" : "hours"
  return `${number} ${unit}`
}
