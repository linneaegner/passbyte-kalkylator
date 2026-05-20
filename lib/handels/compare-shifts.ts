import { calculateSalary } from "./calculate-salary"
import type { CalculationSettings, ShiftInput, ShiftSwapComparison } from "./types"

export function compareShiftSwap(
  shiftYouGive: ShiftInput,
  shiftYouTake: ShiftInput,
  settings: CalculationSettings,
): ShiftSwapComparison {
  const shiftGiveResult = calculateSalary({ ...settings, ...shiftYouGive })
  const shiftTakeResult = calculateSalary({ ...settings, ...shiftYouTake })

  return {
    shiftYouGive: shiftGiveResult,
    shiftYouTake: shiftTakeResult,
    grossDifference: shiftTakeResult.grossSalary - shiftGiveResult.grossSalary,
    netDifference: shiftTakeResult.netSalary - shiftGiveResult.netSalary,
    obDifference: shiftTakeResult.obPay - shiftGiveResult.obPay,
    hoursDifference: shiftTakeResult.totalHours - shiftGiveResult.totalHours,
  }
}

/** Rough monthly impact if similar swaps happen each month. */
export function monthlyImpact(netDifferencePerSwap: number, swapsPerMonth: number): number {
  return netDifferencePerSwap * swapsPerMonth
}
