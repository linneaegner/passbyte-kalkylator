import { getEveDay, isLagerFullDayEve, isPublicHoliday } from "../holidays"
import type { TimeSegment, WorkArea } from "../types"
import {
  butikSaturday,
  butikSundayOrHoliday,
  butikWeekdayEvening,
} from "./segments-butik"
import {
  lagerFullDayOb,
  lagerSaturday,
  lagerSundayOrHoliday,
  lagerWeekday,
} from "./segments-lager"

export function getObSegments(workArea: WorkArea, date: Date): TimeSegment[] {
  const dayOfWeek = date.getDay()

  if (isPublicHoliday(date)) {
    return workArea === "Butik"
      ? butikSundayOrHoliday(date, "Helgdag")
      : lagerSundayOrHoliday(date, "Helgdag")
  }

  const eveDay = getEveDay(date)
  if (eveDay) {
    if (workArea === "Butik") return butikSaturday(date)
    if (isLagerFullDayEve(eveDay)) {
      return lagerFullDayOb(date, `Storhelgsafton (${eveDay})`)
    }
    return lagerSaturday(date)
  }

  if (workArea === "Butik") {
    if (dayOfWeek === 0) return butikSundayOrHoliday(date)
    if (dayOfWeek === 6) return butikSaturday(date)
    return butikWeekdayEvening(date)
  }

  if (dayOfWeek === 0) return lagerSundayOrHoliday(date)
  if (dayOfWeek === 6) return lagerSaturday(date)
  return lagerWeekday(date)
}
