import type { TimeSegment } from "../types"
import { atTime, endOfDay, nextDayAt } from "./utils"

/** Butik: mån–fre 18:15–20:00 (50 %), efter 20:00 (70 %), lör efter 12:00 (100 %), sön/helgdag (100 %). */
export function butikWeekdayEvening(date: Date): TimeSegment[] {
  return [
    {
      start: atTime(date, 18, 15),
      end: atTime(date, 20, 0),
      obPercentage: 50,
      type: "OB Kväll (50%)",
    },
    {
      start: atTime(date, 20, 0),
      end: nextDayAt(date, 6, 0),
      obPercentage: 70,
      type: "OB Natt (70%)",
    },
  ]
}

export function butikSaturday(date: Date): TimeSegment[] {
  return [
    {
      start: atTime(date, 12, 0),
      end: endOfDay(date),
      obPercentage: 100,
      type: "OB Lördag (100%)",
    },
  ]
}

export function butikSundayOrHoliday(date: Date, label = "OB Söndag"): TimeSegment[] {
  return [
    {
      start: atTime(date, 0, 0, 0, 0),
      end: endOfDay(date),
      obPercentage: 100,
      type: label,
    },
  ]
}
