"use client"

import { useMemo, useState } from "react"
import { ShiftInputCard } from "@/components/shift-input-card"
import { SwapComparisonResult } from "@/components/swap-comparison-result"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSalaryPreferences } from "@/hooks/use-salary-preferences"
import { compareShiftSwap, type ShiftInput, type WorkArea } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"

const defaultShift: ShiftInput = {
  startTime: "10:00",
  endTime: "18:00",
  breakMinutes: 30,
}

export function ShiftSwapCalculator() {
  const { t } = useLanguage()
  const prefs = useSalaryPreferences()
  const [shiftGive, setShiftGive] = useState<ShiftInput>(defaultShift)
  const [shiftTake, setShiftTake] = useState<ShiftInput>(defaultShift)

  const settings = useMemo(
    () => ({
      workArea: prefs.workArea,
      baseWage: prefs.baseWage,
      taxRate: prefs.taxRate,
    }),
    [prefs.workArea, prefs.baseWage, prefs.taxRate],
  )

  const comparison = useMemo(() => {
    if (!shiftGive.date || !shiftTake.date) return null
    return compareShiftSwap(shiftGive, shiftTake, settings)
  }, [shiftGive, shiftTake, settings])

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <fieldset className="rounded-lg border bg-card p-4 space-y-4">
        <legend className="sr-only">{t("settings.workArea")}</legend>

        <RadioGroup
          value={prefs.workArea}
          onValueChange={(v) => prefs.setWorkArea(v as WorkArea)}
          className="flex gap-4"
          aria-label={t("settings.workArea")}
        >
          {(
            [
              ["Butik", "settings.store"],
              ["Lager", "settings.warehouse"],
              ["E-handel", "settings.ecommerce"],
            ] as const
          ).map(([value, labelKey]) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value} className="font-normal cursor-pointer">
                {t(labelKey)}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="wage">{t("settings.wage")}</Label>
            <Input
              id="wage"
              type="number"
              min={0}
              step={0.01}
              inputMode="decimal"
              value={prefs.baseWage}
              onChange={(e) => prefs.setBaseWage(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tax">{t("settings.tax")}</Label>
            <Input
              id="tax"
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={prefs.taxRate}
              onChange={(e) => prefs.setTaxRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="swaps">{t("settings.swaps")}</Label>
            <Input
              id="swaps"
              type="number"
              min={0}
              max={31}
              inputMode="numeric"
              value={prefs.swapsPerMonth}
              onChange={(e) => prefs.setSwapsPerMonth(Number(e.target.value))}
            />
          </div>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <ShiftInputCard title={t("shift.give")} value={shiftGive} onChange={setShiftGive} />
        <ShiftInputCard title={t("shift.take")} value={shiftTake} onChange={setShiftTake} />
      </div>

      {comparison ? (
        <SwapComparisonResult comparison={comparison} swapsPerMonth={prefs.swapsPerMonth} />
      ) : (
        <p className="rounded-lg border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          {t("result.pickDates")}
        </p>
      )}
    </div>
  )
}
