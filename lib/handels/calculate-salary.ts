import { isSupportedYear } from "./holidays"
import { getObSegments } from "./ob/get-ob-segments"
import { mergeObBreakdown } from "./ob/merge-breakdown"
import { calculateOverlapHours } from "./ob/utils"
import { calendarDaysInShift, parseShiftBounds } from "./shift"
import type { ObBreakdownItem, SalaryCalculationParams, SalaryResult, SalaryWarning } from "./types"

function collectWarnings(dates: Date[]): SalaryWarning[] {
  const warnings: SalaryWarning[] = []
  const unsupportedYears = [...new Set(dates.map((d) => d.getFullYear()).filter((y) => !isSupportedYear(y)))]
  if (unsupportedYears.length > 0) {
    warnings.push({ code: "unsupportedHolidayYears", years: unsupportedYears })
  }
  return warnings
}

export function calculateSalary(params: SalaryCalculationParams): SalaryResult {
  const { workArea, date, startTime, endTime, breakMinutes, breakStartTime, baseWage, taxRate } = params
  const bounds = parseShiftBounds(date, startTime, endTime, breakMinutes, breakStartTime)
  const { start, end, grossHours, paidHours, workIntervals } = bounds

  const basePay = paidHours * baseWage
  const rawBreakdown: ObBreakdownItem[] = []
  const allDays = calendarDaysInShift(start, end)

  for (const interval of workIntervals) {
    const days = calendarDaysInShift(interval.start, interval.end)
    for (const day of days) {
      const segments = getObSegments(workArea, day)
      for (const segment of segments) {
        const overlapHours = calculateOverlapHours(
          interval.start,
          interval.end,
          segment.start,
          segment.end,
        )
        if (overlapHours <= 0) continue

        const obAmount = overlapHours * baseWage * (segment.obPercentage / 100)
        rawBreakdown.push({
          type: segment.type,
          amount: obAmount,
          percentage: segment.obPercentage,
          hours: overlapHours,
        })
      }
    }
  }

  const obBreakdown = mergeObBreakdown(rawBreakdown)
  const obPay = obBreakdown.reduce((sum, item) => sum + item.amount, 0)
  const grossSalary = basePay + obPay
  const netFactor = 1 - taxRate / 100
  const netSalary = grossSalary * netFactor
  const obPayNet = obPay * netFactor

  return {
    grossSalary,
    netSalary,
    obPay,
    obPayNet,
    totalHours: paidHours,
    grossHours,
    basePay,
    obBreakdown,
    warnings: collectWarnings(allDays),
  }
}
