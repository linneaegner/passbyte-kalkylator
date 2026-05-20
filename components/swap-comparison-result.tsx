"use client"

import { formatSignedSek, formatSek } from "@/lib/format"
import type { ShiftSwapComparison } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"

interface SwapComparisonResultProps {
  comparison: ShiftSwapComparison
  taxRate: number
}

function formatHours(hours: number, locale: string): string {
  const rounded = Math.round(Math.abs(hours) * 10) / 10
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(rounded)
}

export function SwapComparisonResult({ comparison, taxRate }: SwapComparisonResultProps) {
  const { language, t } = useLanguage()
  const { netDifference, grossDifference, hoursDifference, shiftYouGive, shiftYouTake } = comparison

  const isGain = netDifference > 0.5
  const isLoss = netDifference < -0.5
  const absAmount = Math.abs(netDifference)

  const verdictColor = isGain
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : isLoss
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-slate-700 bg-slate-50 border-slate-200"

  const hoursHint =
    Math.abs(hoursDifference) >= 0.1
      ? hoursDifference > 0
        ? t("result.hoursMore", { hours: formatHours(hoursDifference, language === "sv" ? "sv-SE" : "en-SE") })
        : t("result.hoursLess", { hours: formatHours(hoursDifference, language === "sv" ? "sv-SE" : "en-SE") })
      : null

  return (
    <section aria-live="polite" aria-atomic="true" className="space-y-3">
      <div
        className={`rounded-xl border-2 p-8 text-center ${verdictColor}`}
        role="status"
      >
        {isGain || isLoss ? (
          <>
            <p className="text-base font-medium">
              {isGain ? t("result.gainLead") : t("result.lossLead")}
            </p>
            <p className="text-4xl font-bold tracking-tight mt-1 tabular-nums">
              {formatSek(absAmount)}
            </p>
            {isGain && (
              <p className="text-base font-medium mt-1">{t("result.gainTrail")}</p>
            )}
          </>
        ) : (
          <p className="text-2xl font-semibold">{t("result.sameHeadline")}</p>
        )}
        <p className="text-sm mt-3 opacity-80">{t("result.compareHint")}</p>
        {hoursHint && <p className="text-sm mt-1 opacity-70">{hoursHint}</p>}
      </div>

      <details className="rounded-lg border bg-card">
        <summary className="cursor-pointer px-4 py-3 text-sm text-muted-foreground hover:text-foreground">
          {t("result.howCalculated")}
        </summary>
        <div className="px-4 pb-4 text-sm tabular-nums space-y-4">
          <p className="text-muted-foreground text-xs leading-relaxed">{t("result.formulaExplain")}</p>
          <p className="text-muted-foreground text-xs leading-relaxed rounded-md bg-muted/50 px-3 py-2">
            {t("result.nettoExplain", { tax: taxRate })}
          </p>

          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="pb-2 text-left font-normal" />
                <th className="pb-2 text-right font-normal">{t("result.afterTax")}</th>
                <th className="pb-2 text-right font-normal hidden sm:table-cell">{t("result.beforeTax")}</th>
              </tr>
            </thead>
            <tbody>
              <ShiftRow
                label={t("result.takeRow")}
                net={shiftYouTake.netSalary}
                gross={shiftYouTake.grossSalary}
              />
              <ShiftRow
                label={t("result.giveRow")}
                net={shiftYouGive.netSalary}
                gross={shiftYouGive.grossSalary}
                subtract
              />
              <tr className="border-t">
                <td className="pt-3 font-semibold">{t("result.diffRow")}</td>
                <td className="pt-3 text-right font-semibold">{formatSignedSek(netDifference)}</td>
                <td className="pt-3 text-right font-semibold text-muted-foreground hidden sm:table-cell">
                  {formatSignedSek(grossDifference)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </section>
  )
}

function ShiftRow({
  label,
  net,
  gross,
  subtract,
}: {
  label: string
  net: number
  gross: number
  subtract?: boolean
}) {
  return (
    <tr>
      <td className="py-1.5 text-muted-foreground">
        {subtract ? "− " : ""}
        {label}
      </td>
      <td className="py-1.5 text-right">{formatSek(net)}</td>
      <td className="py-1.5 text-right text-muted-foreground hidden sm:table-cell">{formatSek(gross)}</td>
    </tr>
  )
}
