import { calculateSalary } from "./calculate-salary"
import type { CalculationSettings, ShiftInput, ShiftSwapComparison } from "./types"

/**
 * Jämför ett passbyte: vad du tjänar om du jobbar "tar"-passet istället för "lämnar"-passet.
 * netDifference = netto(tar) − netto(lämnar)
 * Positivt = du får mer pengar genom bytet.
 */
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
