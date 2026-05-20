export type WorkArea = "Butik" | "Lager" | "E-handel"

export type EveDayKind = "Påskafton" | "Midsommarafton" | "Julafton" | "Nyårsafton"

export interface CalculationSettings {
  workArea: WorkArea
  baseWage: number
  taxRate: number
}

export interface ShiftInput {
  date?: Date
  startTime: string
  endTime: string
  breakMinutes: number
}

export interface SalaryCalculationParams extends CalculationSettings, ShiftInput {}

export interface TimeSegment {
  start: Date
  end: Date
  obPercentage: number
  type: string
}

export interface ObBreakdownItem {
  type: string
  amount: number
  percentage: number
  hours: number
}

export interface SalaryResult {
  grossSalary: number
  netSalary: number
  obPay: number
  totalHours: number
  grossHours: number
  basePay: number
  obBreakdown: ObBreakdownItem[]
  warnings: string[]
}

export interface ShiftSwapComparison {
  shiftYouGive: SalaryResult
  shiftYouTake: SalaryResult
  /** Positive = you earn more by taking the swap. */
  grossDifference: number
  netDifference: number
  obDifference: number
  hoursDifference: number
}
