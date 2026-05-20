"use client"

import { useMemo, useState } from "react"
import { ShiftInputCard } from "@/components/shift-input-card"
import { SwapComparisonResult } from "@/components/swap-comparison-result"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useSalaryPreferences } from "@/hooks/use-salary-preferences"
import { formatSek } from "@/lib/format"
import {
  compareShiftSwap,
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

const WORK_AREAS = [
  ["Butik", "settings.store"],
  ["Lager", "settings.warehouse"],
  ["E-handel", "settings.ecommerce"],
] as const

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

  const wageTierLabel = (tier: Exclude<WageTier, "custom">) => t(`wageTier.${tier}`)

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <ToggleGroup
          type="single"
          value={prefs.workArea}
          onValueChange={(v) => v && prefs.setWorkArea(v as WorkArea)}
          className="grid w-full grid-cols-3 gap-1 rounded-lg bg-muted/60 p-1"
          variant="outline"
          size="sm"
          aria-label={t("settings.workArea")}
        >
          {WORK_AREAS.map(([value, labelKey]) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="rounded-md border-0 px-2 text-sm data-[state=on]:bg-background data-[state=on]:text-[#0a3e41] data-[state=on]:shadow-sm"
            >
              {t(labelKey)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="grid gap-4 sm:grid-cols-[1fr_5.5rem] sm:items-start">
          <div className="space-y-1.5">
            <Label htmlFor="wage-tier">{t("settings.wageTier")}</Label>
            <Select value={prefs.wageTier} onValueChange={(v) => prefs.setWageTier(v as WageTier)}>
              <SelectTrigger id="wage-tier">
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
            {prefs.wageTier === "custom" ? (
              <Input
                id="wage"
                type="number"
                min={0}
                step={0.01}
                aria-label={t("settings.wage")}
                placeholder={t("settings.wage")}
                value={prefs.customWage}
                onChange={(e) => prefs.setCustomWage(Number(e.target.value))}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                {formatSek(prefs.baseWage)}
                {t("settings.wagePerHour")}
              </p>
            )}
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
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ShiftInputCard title={t("shift.give")} value={shiftGive} onChange={setShiftGive} />
        <ShiftInputCard title={t("shift.take")} value={shiftTake} onChange={setShiftTake} />
      </div>

      <SwapComparisonResult comparison={comparison} taxRate={prefs.taxRate} />
    </div>
  )
}
