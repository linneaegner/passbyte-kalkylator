import { describe, expect, it } from "vitest"
import { calculateSalary } from "./calculate-salary"
import { compareShiftSwap } from "./compare-shifts"

const settings = {
  workArea: "Lager" as const,
  baseWage: 160.4,
  taxRate: 0,
}

const shift = (overrides: Partial<Parameters<typeof calculateSalary>[0]>) => ({
  date: new Date(2026, 11, 24),
  startTime: "10:00",
  endTime: "18:00",
  breakMinutes: 0,
  breakStartTime: "12:00",
  ...settings,
  ...overrides,
})

describe("calculateSalary", () => {
  it("ger 100 % OB hela dagen på julafton för lager", () => {
    const result = calculateSalary(
      shift({ date: new Date(2026, 11, 24), startTime: "08:00", endTime: "16:00" }),
    )
    expect(result.obPay).toBeCloseTo(result.totalHours * 160.4, 1)
    expect(result.grossSalary).toBeCloseTo(result.totalHours * 160.4 * 2, 1)
  })

  it("räknar OB över midnatt på flera kalenderdagar", () => {
    const result = calculateSalary(
      shift({
        workArea: "Butik",
        date: new Date(2026, 0, 5),
        startTime: "19:00",
        endTime: "02:00",
      }),
    )
    expect(result.obPay).toBeGreaterThan(0)
    expect(result.grossHours).toBe(7)
  })

  it("räknar inte OB under rasten", () => {
    const noBreak = calculateSalary(shift({ breakMinutes: 0 }))
    const lunchBreak = calculateSalary(
      shift({
        workArea: "Butik",
        date: new Date(2026, 0, 7),
        startTime: "17:00",
        endTime: "22:00",
        breakMinutes: 30,
        breakStartTime: "18:00",
      }),
    )
    expect(lunchBreak.obPay).toBeLessThan(noBreak.obPay)
    expect(lunchBreak.totalHours).toBe(4.5)
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
        breakStartTime: "12:00",
      },
      {
        date: new Date(2026, 0, 7),
        startTime: "10:00",
        endTime: "18:00",
        breakMinutes: 30,
        breakStartTime: "12:00",
      },
      { ...settings, workArea: "Butik" },
    )
    expect(comparison.netDifference).toBeLessThan(-50)
  })
})
