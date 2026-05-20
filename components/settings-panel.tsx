"use client"

import { ChevronDown, Settings2 } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatSek } from "@/lib/format"
import { type WageTier, type WorkArea } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

const WAGE_TIERS: Exclude<WageTier, "custom">[] = [
  "age16",
  "age17",
  "age18",
  "age19",
  "exp1",
  "exp2",
  "exp3",
]

const WORK_AREAS: { value: WorkArea; labelKey: string }[] = [
  { value: "Butik", labelKey: "settings.store" },
  { value: "Lager", labelKey: "settings.warehouse" },
  { value: "E-handel", labelKey: "settings.ecommerce" },
]

interface SettingsPanelProps {
  workArea: WorkArea
  setWorkArea: (area: WorkArea) => void
  wageTier: WageTier
  setWageTier: (tier: WageTier) => void
  customWage: number
  setCustomWage: (wage: number) => void
  baseWage: number
  taxRate: number
  setTaxRate: (rate: number) => void
}

export function SettingsPanel({
  workArea,
  setWorkArea,
  wageTier,
  setWageTier,
  customWage,
  setCustomWage,
  baseWage,
  taxRate,
  setTaxRate,
}: SettingsPanelProps) {
  const { t } = useLanguage()

  const workAreaLabel = WORK_AREAS.find((a) => a.value === workArea)
  const wageLabel =
    wageTier === "custom"
      ? formatSek(customWage)
      : t(`wageTier.${wageTier}`)
  const summary = t("settings.summary", {
    area: workAreaLabel ? t(workAreaLabel.labelKey) : workArea,
    wage: wageLabel,
    tax: taxRate,
  })

  return (
    <Collapsible defaultOpen={false} className="group rounded-xl border bg-card shadow-sm">
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3.5 text-left min-h-[52px] group">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Settings2 className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{t("settings.title")}</p>
          <p className="text-xs text-muted-foreground truncate">{summary}</p>
        </div>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t px-4 pb-4 pt-3 space-y-4">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{t("settings.workArea")}</legend>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={t("settings.workArea")}>
            {WORK_AREAS.map(({ value, labelKey }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={workArea === value}
                onClick={() => setWorkArea(value)}
                className={cn(
                  "min-h-11 rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  workArea === value
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-input bg-background text-foreground hover:bg-accent",
                )}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <Label htmlFor="wage-tier">{t("settings.wageTier")}</Label>
          <Select value={wageTier} onValueChange={(v) => setWageTier(v as WageTier)}>
            <SelectTrigger id="wage-tier" className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WAGE_TIERS.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {t(`wageTier.${tier}`)}
                </SelectItem>
              ))}
              <SelectItem value="custom">{t("settings.wageCustom")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {wageTier === "custom" ? (
          <div className="space-y-1.5">
            <Label htmlFor="wage">{t("settings.wage")}</Label>
            <Input
              id="wage"
              type="number"
              min={0}
              step={0.01}
              inputMode="decimal"
              className="min-h-11"
              value={customWage}
              onChange={(e) => setCustomWage(Number(e.target.value))}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("settings.wageFromAgreement")}: {formatSek(baseWage)}{t("settings.wagePerHour")}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="tax">{t("settings.tax")}</Label>
          <Input
            id="tax"
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            className="min-h-11"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
