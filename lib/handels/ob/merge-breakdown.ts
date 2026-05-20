import type { ObBreakdownItem } from "../types"

export function mergeObBreakdown(items: ObBreakdownItem[]): ObBreakdownItem[] {
  const map = new Map<string, ObBreakdownItem>()

  for (const item of items) {
    const key = `${item.type}|${item.percentage}`
    const existing = map.get(key)
    if (existing) {
      existing.hours += item.hours
      existing.amount += item.amount
    } else {
      map.set(key, { ...item })
    }
  }

  return [...map.values()].sort((a, b) => b.amount - a.amount)
}
