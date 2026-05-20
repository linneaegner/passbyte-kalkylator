"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { formatSignedSek, formatSek } from "@/lib/format"
import type { ShiftSwapComparison } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

interface SwapComparisonResultProps {
  comparison: ShiftSwapComparison
  taxRate: number
}

function formatHoursDuration(hours: number, language: "sv" | "en"): string {
  const abs = Math.round(Math.abs(hours) * 10) / 10
  const locale = language === "sv" ? "sv-SE" : "en-US"
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(abs)
  const unit =
    language === "sv" ? (abs === 1 ? "timme" : "timmar") : abs === 1 ? "hour" : "hours"
  return `${number} ${unit}`
}

export function SwapComparisonResult({ comparison, taxRate }: SwapComparisonResultProps) {
  const { language, t } = useLanguage()
  const resultRef = useRef<HTMLElement>(null)
  const [resultVisible, setResultVisible] = useState(false)
  const { netDifference, grossDifference, hoursDifference, shiftYouGive, shiftYouTake } = comparison

  const isGain = netDifference > 0.5
  const isLoss = netDifference < -0.5
  const absAmount = Math.abs(netDifference)

  const verdictStyles = isGain
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : isLoss
      ? "text-red-700 bg-red-50 border-red-200"
      : "text-slate-700 bg-slate-50 border-slate-200"

  const hoursHint =
    Math.abs(hoursDifference) >= 0.1
      ? hoursDifference > 0
        ? t("result.hoursMore", { hours: formatHoursDuration(hoursDifference, language) })
        : t("result.hoursLess", { hours: formatHoursDuration(hoursDifference, language) })
      : null

  const scrollToResult = () => {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  useEffect(() => {
    const el = resultRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setResultVisible(entry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)] transition-transform duration-300",
          resultVisible && "translate-y-full pointer-events-none",
        )}
        aria-hidden={resultVisible}
      >
        <button
          type="button"
          onClick={scrollToResult}
          className={cn(
            "w-full px-4 py-3 flex items-center justify-between gap-3 border-t-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm",
            verdictStyles,
          )}
          aria-label={t("result.scrollToDetails")}
        >
          <span className="text-sm font-medium truncate">
            {isGain ? t("result.gainLead") : isLoss ? t("result.lossLead") : t("result.sameHeadline")}
          </span>
          {(isGain || isLoss) && (
            <span className="text-lg font-bold tabular-nums shrink-0">{formatSek(absAmount)}</span>
          )}
          <ArrowDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
        </button>
      </div>

      <section
        ref={resultRef}
        id="swap-result"
        aria-live="polite"
        aria-atomic="true"
        className="scroll-mt-4"
      >
        {/* Mobile: stacked verdict + collapsible details */}
        <div className="space-y-3 pb-20 md:hidden">
          <VerdictCard
            isGain={isGain}
            isLoss={isLoss}
            absAmount={absAmount}
            hoursHint={hoursHint}
            verdictStyles={verdictStyles}
            layout="stacked"
          />

          <details className="rounded-lg border bg-card group min-w-0">
            <summary className="cursor-pointer px-4 py-3 text-sm text-muted-foreground hover:text-foreground list-none flex items-center gap-2">
              <span
                className="text-[10px] transition-transform group-open:rotate-90"
                aria-hidden
              >
                ▶
              </span>
              {t("result.howCalculated")}
            </summary>
            <CalculationBreakdown
              className="px-4 pb-4 border-t pt-3"
              taxRate={taxRate}
              shiftYouGive={shiftYouGive}
              shiftYouTake={shiftYouTake}
              netDifference={netDifference}
              grossDifference={grossDifference}
            />
          </details>
        </div>

        {/* Desktop: one full-width card — verdict strip + always-visible breakdown */}
        <article
          className={cn(
            "hidden md:block rounded-xl border-2 overflow-hidden shadow-sm",
            verdictStyles,
          )}
        >
          <header className="px-6 py-5" role="status">
            <VerdictCard
              isGain={isGain}
              isLoss={isLoss}
              absAmount={absAmount}
              hoursHint={hoursHint}
              verdictStyles=""
              layout="horizontal"
            />
          </header>

          <div className="border-t bg-card text-card-foreground px-6 py-5">
            <h2 className="text-sm font-semibold mb-4">{t("result.howCalculated")}</h2>
            <CalculationBreakdown
              taxRate={taxRate}
              shiftYouGive={shiftYouGive}
              shiftYouTake={shiftYouTake}
              netDifference={netDifference}
              grossDifference={grossDifference}
            />
          </div>
        </article>
      </section>
    </>
  )
}

function VerdictCard({
  isGain,
  isLoss,
  absAmount,
  hoursHint,
  verdictStyles,
  layout,
}: {
  isGain: boolean
  isLoss: boolean
  absAmount: number
  hoursHint: string | null
  verdictStyles: string
  layout: "stacked" | "horizontal"
}) {
  const { t } = useLanguage()
  const stacked = layout === "stacked"

  return (
    <div
      className={cn(
        stacked && cn("rounded-xl border-2 p-6 sm:p-8 text-center", verdictStyles),
        !stacked && "flex flex-wrap items-center justify-between gap-4 gap-y-2",
      )}
    >
      <div className={cn(stacked ? undefined : "min-w-0 flex-1")}>
        {isGain || isLoss ? (
          <div
            className={cn(
              stacked
                ? undefined
                : "flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1",
            )}
          >
            <p className={cn("font-medium", stacked ? "text-base" : "text-lg")}>
              {isGain ? t("result.gainLead") : t("result.lossLead")}
            </p>
            <p
              className={cn(
                "font-bold tracking-tight tabular-nums",
                stacked ? "text-4xl mt-1" : "text-3xl sm:text-4xl",
              )}
            >
              {formatSek(absAmount)}
            </p>
            {isGain && (
              <p className={cn("font-medium", stacked ? "text-base mt-1" : "text-lg")}>
                {t("result.gainTrail")}
              </p>
            )}
          </div>
        ) : (
          <p className={cn("font-semibold", stacked ? "text-2xl" : "text-xl sm:text-2xl")}>
            {t("result.sameHeadline")}
          </p>
        )}
        <p className={cn("text-sm opacity-80", stacked ? "mt-3" : "mt-1")}>
          {t("result.compareHint")}
        </p>
      </div>

      {hoursHint && (
        <p
          className={cn(
            "text-sm opacity-70 shrink-0",
            stacked ? "mt-1" : "rounded-md bg-black/5 px-3 py-1.5",
          )}
        >
          {hoursHint}
        </p>
      )}
    </div>
  )
}

function CalculationBreakdown({
  className,
  taxRate,
  shiftYouGive,
  shiftYouTake,
  netDifference,
  grossDifference,
}: {
  className?: string
  taxRate: number
  shiftYouGive: ShiftSwapComparison["shiftYouGive"]
  shiftYouTake: ShiftSwapComparison["shiftYouTake"]
  netDifference: number
  grossDifference: number
}) {
  const { t } = useLanguage()

  return (
    <div className={cn("text-sm tabular-nums space-y-4", className)}>
      <p className="text-muted-foreground text-xs leading-relaxed">{t("result.formulaExplain")}</p>
      <p className="text-muted-foreground text-xs leading-relaxed rounded-md bg-muted/50 px-3 py-2">
        {t("result.nettoExplain", { tax: taxRate })}
      </p>

      <table className="w-full max-w-xl">
        <thead>
          <tr className="text-xs text-muted-foreground">
            <th className="pb-2 text-left font-normal" scope="col" />
            <th className="pb-2 text-right font-normal" scope="col">
              {t("result.afterTax")}
            </th>
            <th className="pb-2 text-right font-normal" scope="col">
              {t("result.beforeTax")}
            </th>
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
            <td className="pt-3 text-right font-semibold text-muted-foreground">
              {formatSignedSek(grossDifference)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
      <td className="py-1.5 text-right text-muted-foreground">{formatSek(gross)}</td>
    </tr>
  )
}
