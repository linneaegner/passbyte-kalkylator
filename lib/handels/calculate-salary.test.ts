import { describe, expect, it } from "vitest"
import { calculateSalary } from "./calculate-salary"
import { compareShiftSwap } from "./compare-shifts"

const settings = {
  workArea: "Lager" as const,
  baseWage: 160.4,
  taxRate: 0,
}

describe("calculateSalary", () => {
  it("ger 100 % OB hela dagen på julafton för lager", () => {
    const result = calculateSalary({
      ...settings,
      date: new Date(2026, 11, 24),
      startTime: "08:00",
      endTime: "16:00",
      breakMinutes: 0,
    })
    expect(result.obPay).toBeCloseTo(result.totalHours * 160.4, 1)
    expect(result.grossSalary).toBeCloseTo(result.totalHours * 160.4 * 2, 1)
  })

  it("räknar OB över midnatt på flera kalenderdagar", () => {
    const result = calculateSalary({
      ...settings,
      workArea: "Butik",
      date: new Date(2026, 0, 5),
      startTime: "19:00",
      endTime: "02:00",
      breakMinutes: 0,
    })
    expect(result.obPay).toBeGreaterThan(0)
    expect(result.grossHours).toBe(7)
  })

  it("drar av rast proportionellt från OB", () => {
    const noBreak = calculateSalary({
      ...settings,
      date: new Date(2026, 11, 24),
      startTime: "10:00",
      endTime: "18:00",
      breakMinutes: 0,
    })
    const withBreak = calculateSalary({
      ...settings,
      date: new Date(2026, 11, 24),
      startTime: "10:00",
      endTime: "18:00",
      breakMinutes: 60,
    })
    expect(withBreak.obPay).toBeLessThan(noBreak.obPay)
    expect(withBreak.totalHours).toBe(7)
  })
})

describe("compareShiftSwap", () => {
  it("visar förlust när man lämnar juldag och tar vardag i butik", () => {
    const comparison = compareShiftSwap(
      {
        date: new Date(2026, 11, 25),
        startTime: "10:00",
        endTime: "18:00",
        breakMinutes: 30,
      },
      {
        date: new Date(2026, 0, 7),
        startTime: "10:00",
        endTime: "18:00",
        breakMinutes: 30,
      },
      { ...settings, workArea: "Butik" },
    )
    expect(comparison.netDifference).toBeLessThan(-50)
  })
})
