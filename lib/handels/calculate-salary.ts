import { getObSegments } from "./ob/get-ob-segments"
import { calculateOverlapHours } from "./ob/utils"
import type { SalaryCalculationParams, SalaryResult } from "./types"

function parseShiftBounds(date: Date, startTime: string, endTime: string): { start: Date; end: Date } {
  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const start = new Date(date)
  start.setHours(startHour, startMinute, 0, 0)

  const end = new Date(date)
  if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
    end.setDate(end.getDate() + 1)
  }
  end.setHours(endHour, endMinute, 0, 0)

  return { start, end }
}

export function calculateSalary(params: SalaryCalculationParams): SalaryResult {
  const { workArea, date, startTime, endTime, breakMinutes, baseWage, taxRate } = params
  const { start: startDate, end: endDate } = parseShiftBounds(date, startTime, endTime)

  const totalHoursWithBreak = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
  const totalHours = totalHoursWithBreak - breakMinutes / 60
  const basePay = totalHours * baseWage

  const obSegments = getObSegments(workArea, new Date(date))
  const obBreakdown: SalaryResult["obBreakdown"] = []
  let totalObPay = 0

  for (const segment of obSegments) {
    const overlapHours = calculateOverlapHours(startDate, endDate, segment.start, segment.end)
    if (overlapHours <= 0) continue

    const obAmount = overlapHours * baseWage * (segment.obPercentage / 100)
    totalObPay += obAmount
    obBreakdown.push({
      type: segment.type,
      amount: obAmount,
      percentage: segment.obPercentage,
      hours: overlapHours,
    })
  }

  const grossSalary = basePay + totalObPay
  const netSalary = grossSalary * (1 - taxRate / 100)

  return {
    grossSalary,
    netSalary,
    totalHours,
    basePay,
    obBreakdown,
  }
}
