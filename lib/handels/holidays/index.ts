import { SUPPORTED_HOLIDAY_YEARS } from "../config"
import type { EveDayKind } from "../types"
import { eveDays2026, publicHolidays2026 } from "./2026"

function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getCalendarForYear(year: number) {
  if (year === 2026) {
    return {
      publicHolidays: publicHolidays2026,
      eveDays: eveDays2026,
    }
  }
  return null
}

export function isSupportedYear(year: number): boolean {
  return (SUPPORTED_HOLIDAY_YEARS as readonly number[]).includes(year)
}

export function isPublicHoliday(date: Date): boolean {
  const calendar = getCalendarForYear(date.getFullYear())
  if (!calendar) return false
  const key = toDateKey(date)
  return calendar.publicHolidays.some((h) => h.date === key)
}

export function getEveDay(date: Date): EveDayKind | null {
  const calendar = getCalendarForYear(date.getFullYear())
  if (!calendar) return null
  const key = toDateKey(date)
  const match = calendar.eveDays.find((e) => e.date === key)
  return match?.kind ?? null
}

export function isLagerFullDayEve(eve: EveDayKind): boolean {
  return eve !== "Påskafton"
}
