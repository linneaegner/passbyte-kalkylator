"use client"

import { formatSignedSek, formatSek } from "@/lib/format"
import type { ShiftSwapComparison } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"

interface SwapComparisonResultProps {
  comparison: ShiftSwapComparison
}

export function SwapComparisonResult({ comparison }: SwapComparisonResultProps) {
  const { t } = useLanguage()
  const { netDifference, shiftYouGive, shiftYouTake } = comparison

  const isGain = netDifference > 0.5
  const isLoss = netDifference < -0.5
  const absAmount = Math.abs(netDifference)

  const verdictColor = isGain
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : isLoss
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-slate-700 bg-slate-50 border-slate-200"

  const headline = isGain
    ? t("result.more", { amount: formatSek(absAmount) })
    : isLoss
      ? t("result.less", { amount: formatSek(absAmount) })
      : t("result.same")

  return (
    <section aria-live="polite" aria-atomic="true" className="space-y-3">
      <div
        className={`rounded-xl border-2 p-8 text-center ${verdictColor}`}
        role="status"
      >
        <p className="text-lg font-medium">{headline}</p>
        <p className="text-sm mt-2 opacity-80">{t("result.nettoHint")}</p>
      </div>

      <details className="rounded-lg border bg-card">
        <summary className="cursor-pointer px-4 py-3 text-sm text-muted-foreground hover:text-foreground">
          {t("result.howCalculated")}
        </summary>
        <div className="px-4 pb-4 text-sm tabular-nums space-y-3">
          <p className="text-muted-foreground text-xs">{t("result.formulaExplain")}</p>

          <table className="w-full">
            <tbody className="space-y-2">
              <MathRow label={t("result.takeRow")} value={shiftYouTake.netSalary} />
              <MathRow label={t("result.giveRow")} value={shiftYouGive.netSalary} subtract />
              <tr className="border-t">
                <td className="pt-3 font-semibold">{t("result.diffRow")}</td>
                <td className="pt-3 text-right font-semibold">{formatSignedSek(netDifference)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </section>
  )
}

function MathRow({
  label,
  value,
  subtract,
}: {
  label: string
  value: number
  subtract?: boolean
}) {
  return (
    <tr>
      <td className="py-1.5 text-muted-foreground">
        {subtract ? "− " : ""}
        {label}
      </td>
      <td className="py-1.5 text-right">{formatSek(value)}</td>
    </tr>
  )
}
