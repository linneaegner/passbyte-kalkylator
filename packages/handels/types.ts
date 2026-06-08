export type WorkArea = "Butik" | "Lager" | "E-handel"

export type EveDayKind = "Påskafton" | "Midsommarafton" | "Julafton" | "Nyårsafton"

export interface CalculationSettings {
  workArea: WorkArea
  baseWage: number
  taxRate: number
}

export interface ShiftInput {
  date: Date
  startTime: string
  endTime: string
  breakMinutes: number
  /** När rasten börjar (HH:mm). */
  breakStartTime: string
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

export type SalaryWarning =
  | { code: "unsupportedHolidayYears"; years: number[] }

export interface SalaryResult {
  grossSalary: number
  netSalary: number
  /** OB-tillägg före skatt. */
  obPay: number
  /** OB-tillägg efter samma skattesats som övrig lön. */
  obPayNet: number
  totalHours: number
  grossHours: number
  basePay: number
  obBreakdown: ObBreakdownItem[]
  warnings: SalaryWarning[]
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
