import { isSupportedYear } from "./holidays"
import { getObSegments } from "./ob/get-ob-segments"
import { mergeObBreakdown } from "./ob/merge-breakdown"
import { calculateOverlapHours } from "./ob/utils"
import { calendarDaysInShift, parseShiftBounds } from "./shift"
import type { ObBreakdownItem, SalaryCalculationParams, SalaryResult } from "./types"

function collectWarnings(dates: Date[]): string[] {
  const warnings: string[] = []
  const unsupportedYears = [...new Set(dates.map((d) => d.getFullYear()).filter((y) => !isSupportedYear(y)))]
  if (unsupportedYears.length > 0) {
    warnings.push(
      `Helgdagar för ${unsupportedYears.join(", ")} saknas — OB kan vara felaktigt. Avtalet gäller 2026.`,
    )
  }
  return warnings
}

export function calculateSalary(params: SalaryCalculationParams): SalaryResult {
  const { workArea, date, startTime, endTime, breakMinutes, baseWage, taxRate } = params
  const bounds = parseShiftBounds(date, startTime, endTime, breakMinutes)
  const { start, end, grossHours, paidHours } = bounds

  const paidRatio = grossHours > 0 ? paidHours / grossHours : 0
  const basePay = paidHours * baseWage

  const rawBreakdown: ObBreakdownItem[] = []
  const days = calendarDaysInShift(start, end)

  for (const day of days) {
    const segments = getObSegments(workArea, day)
    for (const segment of segments) {
      const overlapHours = calculateOverlapHours(start, end, segment.start, segment.end)
      if (overlapHours <= 0) continue

      const paidOverlapHours = overlapHours * paidRatio
      const obAmount = paidOverlapHours * baseWage * (segment.obPercentage / 100)

      rawBreakdown.push({
        type: segment.type,
        amount: obAmount,
        percentage: segment.obPercentage,
        hours: paidOverlapHours,
      })
    }
  }

  const obBreakdown = mergeObBreakdown(rawBreakdown)
  const obPay = obBreakdown.reduce((sum, item) => sum + item.amount, 0)
  const grossSalary = basePay + obPay
  const netSalary = grossSalary * (1 - taxRate / 100)

  return {
    grossSalary,
    netSalary,
    obPay,
    totalHours: paidHours,
    grossHours,
    basePay,
    obBreakdown,
    warnings: collectWarnings(days),
  }
}
