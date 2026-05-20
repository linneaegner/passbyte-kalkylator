"use client"

import { useMemo, useState } from "react"
import { ShiftInputCard } from "@/components/shift-input-card"
import { SwapComparisonResult } from "@/components/swap-comparison-result"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSalaryPreferences } from "@/hooks/use-salary-preferences"
import { formatSek } from "@/lib/format"
import {
  compareShiftSwap,
  WAGE_TIER_LABELS_SV,
  type ShiftInput,
  type WageTier,
  type WorkArea,
} from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"

const WAGE_TIERS: Exclude<WageTier, "custom">[] = [
  "age16",
  "age17",
  "age18",
  "age19",
  "exp1",
  "exp2",
  "exp3",
]

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
  const { language, t } = useLanguage()
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

  const wageTierLabel = (tier: Exclude<WageTier, "custom">) => WAGE_TIER_LABELS_SV[tier]

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <fieldset className="rounded-lg border bg-card p-4 space-y-4">
        <legend className="text-sm font-medium px-1">{t("settings.workArea")}</legend>

        <RadioGroup
          value={prefs.workArea}
          onValueChange={(v) => prefs.setWorkArea(v as WorkArea)}
          className="flex flex-wrap gap-4"
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

        <div className="space-y-1.5">
          <Label>{t("settings.wageTier")}</Label>
          <Select value={prefs.wageTier} onValueChange={(v) => prefs.setWageTier(v as WageTier)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WAGE_TIERS.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {wageTierLabel(tier)}
                </SelectItem>
              ))}
              <SelectItem value="custom">{t("settings.wageCustom")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {prefs.wageTier === "custom" ? (
          <div className="space-y-1.5">
            <Label htmlFor="wage">{t("settings.wage")}</Label>
            <Input
              id="wage"
              type="number"
              min={0}
              step={0.01}
              value={prefs.customWage}
              onChange={(e) => prefs.setCustomWage(Number(e.target.value))}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("settings.wageFromAgreement")}: {formatSek(prefs.baseWage)}/tim
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="tax">{t("settings.tax")}</Label>
          <Input
            id="tax"
            type="number"
            min={0}
            max={100}
            value={prefs.taxRate}
            onChange={(e) => prefs.setTaxRate(Number(e.target.value))}
          />
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <ShiftInputCard title={t("shift.give")} value={shiftGive} onChange={setShiftGive} />
        <ShiftInputCard title={t("shift.take")} value={shiftTake} onChange={setShiftTake} />
      </div>

      <SwapComparisonResult comparison={comparison} taxRate={prefs.taxRate} />
    </div>
  )
}
