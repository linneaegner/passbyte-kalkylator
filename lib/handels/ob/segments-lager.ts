import type { TimeSegment } from "../types"
import { atTime, endOfDay, nextDayAt } from "./utils"

/** Lager / e-handel: mån 00:00–06:00 (70 %), mån–fre 06:00–07:00 (40 %), kväll och natt enligt avtal. */
export function lagerWeekday(date: Date): TimeSegment[] {
  const segments: TimeSegment[] = []
  const dayOfWeek = date.getDay()

  if (dayOfWeek === 1) {
    segments.push({
      start: atTime(date, 0, 0, 0, 0),
      end: atTime(date, 6, 0),
      obPercentage: 70,
      type: "OB Natt (70%)",
    })
  }

  segments.push(
    {
      start: atTime(date, 6, 0),
      end: atTime(date, 7, 0),
      obPercentage: 40,
      type: "OB Morgon (40%)",
    },
    {
      start: atTime(date, 18, 0),
      end: atTime(date, 23, 0),
      obPercentage: 40,
      type: "OB Kväll (40%)",
    },
    {
      start: atTime(date, 23, 0),
      end: nextDayAt(date, 6, 0),
      obPercentage: 70,
      type: "OB Natt (70%)",
    },
  )

  return segments
}

export function lagerSaturday(date: Date): TimeSegment[] {
  return [
    {
      start: atTime(date, 0, 0, 0, 0),
      end: atTime(date, 6, 0),
      obPercentage: 70,
      type: "OB Natt (70%)",
    },
    {
      start: atTime(date, 6, 0),
      end: atTime(date, 23, 0),
      obPercentage: 40,
      type: "OB Lördag (40%)",
    },
    {
      start: atTime(date, 23, 0),
      end: endOfDay(date),
      obPercentage: 70,
      type: "OB Natt (70%)",
    },
  ]
}

export function lagerSundayOrHoliday(date: Date, label = "OB Söndag"): TimeSegment[] {
  return [
    {
      start: atTime(date, 0, 0, 0, 0),
      end: endOfDay(date),
      obPercentage: 100,
      type: label,
    },
  ]
}

export function lagerFullDayOb(date: Date, label: string): TimeSegment[] {
  return [
    {
      start: atTime(date, 0, 0, 0, 0),
      end: endOfDay(date),
      obPercentage: 100,
      type: label,
    },
  ]
}
