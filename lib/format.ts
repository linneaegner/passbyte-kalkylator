export function formatSek(amount: number, locale = "sv-SE"): string {
  return `${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`
}

export function formatSignedSek(amount: number, locale = "sv-SE"): string {
  const prefix = amount > 0 ? "+" : ""
  return `${prefix}${formatSek(amount, locale)}`
}
