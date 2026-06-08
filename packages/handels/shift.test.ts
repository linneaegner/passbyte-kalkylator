import { describe, expect, it } from "vitest"
import { parseShiftBounds } from "./shift"

function bounds(
  date: Date,
  startTime: string,
  endTime: string,
  breakMinutes: number,
  breakStartTime?: string,
) {
  return parseShiftBounds(date, startTime, endTime, breakMinutes, breakStartTime)
}

describe("parseShiftBounds", () => {
  it("ger samma betalda timmar när rasten ligger före passstart (felaktig tid)", () => {
    const date = new Date(2026, 4, 23)
    const withEarlyBreak = bounds(date, "10:00", "18:00", 30, "08:00")
    const withLunchBreak = bounds(date, "10:00", "18:00", 30, "12:00")

    expect(withEarlyBreak.paidHours).toBe(7.5)
    expect(withEarlyBreak.paidHours).toBe(withLunchBreak.paidHours)
  })

  it("räknar rast efter midnatt på nattpass", () => {
    const date = new Date(2026, 0, 5)
    const nightShift = bounds(date, "22:00", "06:00", 30, "02:00")

    expect(nightShift.grossHours).toBe(8)
    expect(nightShift.paidHours).toBe(7.5)
  })
})
