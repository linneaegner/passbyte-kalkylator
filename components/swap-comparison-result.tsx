"use client"

import { formatSignedSek, formatSek } from "@/lib/format"
import type { ShiftSwapComparison } from "@/lib/handels"
import { monthlyImpact } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"

interface SwapComparisonResultProps {
  comparison: ShiftSwapComparison
  swapsPerMonth: number
}

export function SwapComparisonResult({ comparison, swapsPerMonth }: SwapComparisonResultProps) {
  const { t } = useLanguage()
  const { netDifference, grossDifference, obDifference, hoursDifference, shiftYouGive, shiftYouTake } =
    comparison

  const isGain = netDifference > 0.5
  const isLoss = netDifference < -0.5
  const monthly = monthlyImpact(netDifference, swapsPerMonth)
  const showHours = Math.abs(hoursDifference) >= 0.1

  const verdictText = isGain ? t("result.gain") : isLoss ? t("result.loss") : t("result.same")
  const verdictColor = isGain
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : isLoss
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-slate-700 bg-slate-50 border-slate-200"

  return (
    <section aria-live="polite" aria-atomic="true" className="space-y-3">
      <div
        className={`rounded-xl border-2 p-6 text-center ${verdictColor}`}
        role="status"
        aria-label={`${verdictText}: ${formatSignedSek(netDifference)}`}
      >
        <p className="text-sm font-medium">{verdictText}</p>
        <p className="text-4xl font-bold tabular-nums mt-1">{formatSignedSek(netDifference)}</p>
        <p className="text-sm opacity-80 mt-1">{t("result.perSwap")}</p>
        <p className="text-sm mt-2 tabular-nums opacity-90">
          {t("result.summary", {
            gross: formatSignedSek(grossDifference),
            ob: formatSignedSek(obDifference),
          })}
          {showHours && (
            <span className="block mt-1">
              {hoursDifference > 0 ? "+" : ""}
              {hoursDifference.toFixed(1)} h
            </span>
          )}
        </p>
        {swapsPerMonth > 0 && Math.abs(monthly) >= 1 && (
          <p className="text-sm mt-3 font-medium tabular-nums">
            {t("result.monthly", { count: swapsPerMonth, amount: formatSignedSek(monthly) })}
          </p>
        )}
      </div>

      <details className="rounded-lg border bg-card group">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium list-none flex items-center justify-between">
          {t("result.details")}
          <span className="text-muted-foreground text-xs group-open:rotate-180 transition-transform" aria-hidden>
            ▼
          </span>
        </summary>
        <div className="px-4 pb-4 grid gap-3 sm:grid-cols-2 text-sm">
          <ShiftLine
            label={t("result.give")}
            gross={shiftYouGive.grossSalary}
            net={shiftYouGive.netSalary}
            ob={shiftYouGive.obPay}
          />
          <ShiftLine
            label={t("result.take")}
            gross={shiftYouTake.grossSalary}
            net={shiftYouTake.netSalary}
            ob={shiftYouTake.obPay}
          />
        </div>
      </details>
    </section>
  )
}

function ShiftLine({
  label,
  gross,
  net,
  ob,
}: {
  label: string
  gross: number
  net: number
  ob: number
}) {
  const { t } = useLanguage()
  return (
    <div className="rounded-md bg-muted/50 p-3 space-y-1 tabular-nums">
      <p className="font-medium">{label}</p>
      <p className="flex justify-between gap-2">
        <span className="text-muted-foreground">{t("result.gross")}</span>
        <span>{formatSek(gross)}</span>
      </p>
      <p className="flex justify-between gap-2">
        <span className="text-muted-foreground">{t("result.net")}</span>
        <span>{formatSek(net)}</span>
      </p>
      <p className="flex justify-between gap-2">
        <span className="text-muted-foreground">{t("result.ob")}</span>
        <span>{formatSek(ob)}</span>
      </p>
    </div>
  )
}
