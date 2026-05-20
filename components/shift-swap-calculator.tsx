"use client"

import { ArrowRightLeft } from "lucide-react"
import { SettingsPanel } from "@/components/settings-panel"
import { ShiftInputCard } from "@/components/shift-input-card"
import { SwapComparisonResult } from "@/components/swap-comparison-result"
import { useSalaryPreferences } from "@/hooks/use-salary-preferences"
import {
  compareShiftSwap,
  type ShiftInput,
} from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"
import { useMemo, useState } from "react"

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

const defaultShiftTimes = {
  startTime: "10:00",
  endTime: "18:00",
  breakMinutes: 30,
  breakStartTime: "12:00",
} as const

function defaultGiveShift(): ShiftInput {
  return { ...defaultShiftTimes, date: startOfToday() }
}

function defaultTakeShift(): ShiftInput {
  return { ...defaultShiftTimes, date: addDays(startOfToday(), 1) }
}

export function ShiftSwapCalculator() {
  const { t } = useLanguage()
  const prefs = useSalaryPreferences()
  const [shiftGive, setShiftGive] = useState<ShiftInput>(defaultGiveShift)
  const [shiftTake, setShiftTake] = useState<ShiftInput>(defaultTakeShift)

  const settings = useMemo(
    () => ({
      workArea: prefs.workArea,
      baseWage: prefs.baseWage,
      taxRate: prefs.taxRate,
    }),
    [prefs.workArea, prefs.baseWage, prefs.taxRate],
  )

  const comparison = useMemo(
    () => compareShiftSwap(shiftGive, shiftTake, settings),
    [shiftGive, shiftTake, settings],
  )

  return (
    <div className="space-y-4">
      <SettingsPanel
        workArea={prefs.workArea}
        setWorkArea={prefs.setWorkArea}
        wageTier={prefs.wageTier}
        setWageTier={prefs.setWageTier}
        customWage={prefs.customWage}
        setCustomWage={prefs.setCustomWage}
        baseWage={prefs.baseWage}
        taxRate={prefs.taxRate}
        setTaxRate={prefs.setTaxRate}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
        <div className="min-w-0 flex-1">
          <ShiftInputCard
            id="shift-give"
            title={t("shift.give")}
            variant="give"
            value={shiftGive}
            onChange={setShiftGive}
          />
        </div>

        <div
          className="flex shrink-0 justify-center py-0.5 md:items-center md:py-0 md:px-1"
          aria-hidden
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
            <ArrowRightLeft className="h-5 w-5 rotate-90 md:rotate-0" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <ShiftInputCard
            id="shift-take"
            title={t("shift.take")}
            variant="take"
            value={shiftTake}
            onChange={setShiftTake}
          />
        </div>
      </div>

      <SwapComparisonResult comparison={comparison} taxRate={prefs.taxRate} />
    </div>
  )
}
