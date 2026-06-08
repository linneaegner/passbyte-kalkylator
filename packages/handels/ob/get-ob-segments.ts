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

function getLagerObSegments(date: Date, eveDay: ReturnType<typeof getEveDay>): TimeSegment[] {
  const dayOfWeek = date.getDay()

  if (eveDay) {
    if (isLagerFullDayEve(eveDay)) {
      return lagerFullDayOb(date, `Storhelgsafton (${eveDay})`)
    }
    return lagerSaturday(date)
  }

  if (dayOfWeek === 0) return lagerSundayOrHoliday(date)
  if (dayOfWeek === 6) return lagerSaturday(date)
  return lagerWeekday(date)
}

export function getObSegments(workArea: WorkArea, date: Date): TimeSegment[] {
  const dayOfWeek = date.getDay()

  if (isPublicHoliday(date)) {
    return workArea === "Butik"
      ? butikSundayOrHoliday(date, "Helgdag")
      : lagerSundayOrHoliday(date, "Helgdag")
  }

  const eveDay = getEveDay(date)
  if (workArea === "Butik") {
    if (eveDay) return butikSaturday(date)
    if (dayOfWeek === 0) return butikSundayOrHoliday(date)
    if (dayOfWeek === 6) return butikSaturday(date)
    return butikWeekdayEvening(date)
  }

  // Lager and e-handel share the same OB rules.
  return getLagerObSegments(date, eveDay)
}
