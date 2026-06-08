"use client"

import { ArrowRightLeft } from "lucide-react"
import { SettingsPanel } from "@/components/settings-panel"
import { ShiftInputCard } from "@/components/shift-input-card"
import { StepHeader } from "@/components/step-header"
import { SwapComparisonResult } from "@/components/swap-comparison-result"
import { useSalaryPreferences } from "@/hooks/use-salary-preferences"
import {
  compareShiftSwap,
  type ShiftInput,
} from "@passbyte/handels"
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
  return { ...defaultShiftTimes, date: addDays(startOfToday(), 2) }
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

  const handleSwap = () => {
    setShiftGive(shiftTake)
    setShiftTake(shiftGive)
  }

  return (
    <div className="space-y-7">
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

      <div className="space-y-7">
        <div className="md:grid md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] md:gap-x-4 md:items-start">
          <section className="min-w-0 space-y-3" aria-labelledby="step-give-heading">
            <StepHeader step={1} id="step-give-heading" title={t("shift.give")} />
            <ShiftInputCard
              id="shift-give"
              value={shiftGive}
              onChange={setShiftGive}
              hours={comparison.shiftYouGive.totalHours}
            />
          </section>

          <div className="hidden md:flex flex-col items-center justify-center self-center pt-10">
            <button
              type="button"
              onClick={handleSwap}
              aria-label={t("step.swap")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowRightLeft className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <section className="min-w-0 space-y-3 md:mt-0 mt-6" aria-labelledby="step-take-heading">
            <StepHeader step={2} id="step-take-heading" title={t("shift.take")} />
            <ShiftInputCard
              id="shift-take"
              value={shiftTake}
              onChange={setShiftTake}
              hours={comparison.shiftYouTake.totalHours}
            />
          </section>
        </div>

        <div className="flex justify-center md:hidden -my-2">
          <button
            type="button"
            onClick={handleSwap}
            aria-label={t("step.swap")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowRightLeft className="h-5 w-5 rotate-90" aria-hidden />
          </button>
        </div>

        <SwapComparisonResult comparison={comparison} taxRate={prefs.taxRate} />
      </div>
    </div>
  )
}
