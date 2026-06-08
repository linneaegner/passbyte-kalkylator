"use client"

import { useEffect, useRef, useState } from "react"
import { AlertTriangle, ArrowDown, Clock } from "lucide-react"
import { StepHeader } from "@/components/step-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatHoursDuration, formatSignedSek, formatSek } from "@passbyte/shared"
import { AGREEMENT_YEAR, type ObBreakdownItem, type SalaryResult, type SalaryWarning, type ShiftSwapComparison } from "@passbyte/handels"
import { useLanguage } from "@/lib/language-context"
import { cn } from "@/lib/utils"

interface SwapComparisonResultProps {
  comparison: ShiftSwapComparison
  taxRate: number
}

export function SwapComparisonResult({ comparison, taxRate }: SwapComparisonResultProps) {
  const { language, t } = useLanguage()
  const resultRef = useRef<HTMLElement>(null)
  const [resultVisible, setResultVisible] = useState(false)
  const {
    netDifference,
    grossDifference,
    obDifference,
    hoursDifference,
    shiftYouGive,
    shiftYouTake,
  } = comparison

  const isGain = netDifference > 0.5
  const isLoss = netDifference < -0.5
  const absAmount = Math.abs(netDifference)

  const diffNetColor = isGain
    ? "text-verdict-gain-foreground"
    : isLoss
      ? "text-verdict-loss-foreground"
      : "text-foreground"

  const diffGrossColor = isGain
    ? "text-verdict-gain-foreground"
    : isLoss
      ? "text-verdict-loss-foreground"
      : "text-muted-foreground"

  const verdictBg = isGain
    ? "bg-verdict-gain/60"
    : isLoss
      ? "bg-verdict-loss/60"
      : "bg-verdict-neutral/60"

  const stickyBarStyles = isGain
    ? "text-verdict-gain-foreground bg-verdict-gain border-verdict-gain-border"
    : isLoss
      ? "text-verdict-loss-foreground bg-verdict-loss border-verdict-loss-border"
      : "text-verdict-neutral-foreground bg-verdict-neutral border-verdict-neutral-border"

  const hoursHint =
    Math.abs(hoursDifference) >= 0.1
      ? hoursDifference > 0
        ? t("result.hoursMore", {
            hours: formatHoursDuration(hoursDifference, language),
          })
        : t("result.hoursLess", {
            hours: formatHoursDuration(hoursDifference, language),
          })
      : null

  const warnings = mergeWarnings(shiftYouGive.warnings, shiftYouTake.warnings)

  const scrollToResult = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    resultRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    })
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
            "w-full px-4 py-3.5 flex items-center justify-between gap-3 border-t-2 shadow-[0_-4px_24px_hsl(186_65%_15%/0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-opacity-95",
            stickyBarStyles,
          )}
          aria-label={t("result.scrollToDetails")}
        >
          <span className="text-sm font-medium truncate">
            {isGain ? t("result.gainLead") : isLoss ? t("result.lossLead") : t("result.sameHeadline")}
          </span>
          {(isGain || isLoss) && (
            <span className={cn("text-lg font-bold tabular-nums shrink-0", diffNetColor)}>
              {formatSignedSek(isGain ? absAmount : -absAmount)}
            </span>
          )}
          <ArrowDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
        </button>
      </div>

      <section
        ref={resultRef}
        id="swap-result"
        className="space-y-3 scroll-mt-4 pb-20 md:pb-0"
        aria-labelledby="step-result-heading"
        aria-live="polite"
        aria-atomic="true"
      >
        <StepHeader step={3} id="step-result-heading" title={t("step.result.title")} />

        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((warning) => (
              <WarningAlert key={warningMessageKey(warning)} warning={warning} />
            ))}
          </div>
        )}

        <article className="card-surface overflow-hidden">
          <header className={cn("px-5 py-5 sm:px-6 border-b card-divider", verdictBg)} role="status">
            {isGain || isLoss ? (
              <div className="text-center sm:text-left">
                <p className="text-base font-medium text-foreground">
                  {isGain ? t("result.gainLead") : t("result.lossLead")}
                </p>
                <p className={cn("text-4xl sm:text-5xl font-bold tracking-tight tabular-nums mt-1", diffNetColor)}>
                  {formatSignedSek(isGain ? absAmount : -absAmount)}
                </p>
                {isGain && (
                  <p className="text-base font-medium text-foreground mt-1">{t("result.gainTrail")}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">{t("result.compareHint")}</p>
              </div>
            ) : (
              <div className="text-center sm:text-left">
                <p className="text-2xl font-semibold">{t("result.sameHeadline")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("result.compareHint")}</p>
              </div>
            )}

            {hoursHint && (
              <div
                className={cn(
                  "mt-4 flex items-center justify-center sm:justify-start gap-2.5",
                  "rounded-lg border border-primary/25 bg-background/90 px-3.5 py-2.5 shadow-sm",
                )}
              >
                <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <p className="text-sm font-semibold text-foreground">{hoursHint}</p>
              </div>
            )}
          </header>

          <div className="px-5 py-5 sm:px-6 space-y-4">
            <details className="group md:hidden">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground list-none flex items-center gap-2 mb-4">
                <span className="text-[10px] transition-transform group-open:rotate-90" aria-hidden>
                  ▶
                </span>
                {t("result.howCalculated")}
              </summary>
              <CalculationBreakdown
                taxRate={taxRate}
                shiftYouGive={shiftYouGive}
                shiftYouTake={shiftYouTake}
                netDifference={netDifference}
                grossDifference={grossDifference}
                obDifference={obDifference}
                diffNetColor={diffNetColor}
                diffGrossColor={diffGrossColor}
                isGain={isGain}
                isLoss={isLoss}
              />
            </details>

            <div className="hidden md:block">
              <h3 className="text-sm font-semibold mb-4">{t("result.howCalculated")}</h3>
              <CalculationBreakdown
                taxRate={taxRate}
                shiftYouGive={shiftYouGive}
                shiftYouTake={shiftYouTake}
                netDifference={netDifference}
                grossDifference={grossDifference}
                obDifference={obDifference}
                diffNetColor={diffNetColor}
                diffGrossColor={diffGrossColor}
                isGain={isGain}
                isLoss={isLoss}
              />
            </div>
          </div>
        </article>
      </section>
    </>
  )
}

function mergeWarnings(...groups: SalaryWarning[][]): SalaryWarning[] {
  const merged = new Map<string, SalaryWarning>()

  for (const group of groups) {
    for (const warning of group) {
      if (warning.code === "unsupportedHolidayYears") {
        const key = warning.code
        const existing = merged.get(key)
        if (existing?.code === "unsupportedHolidayYears") {
          const years = [...new Set([...existing.years, ...warning.years])].sort((a, b) => a - b)
          merged.set(key, { code: warning.code, years })
        } else {
          merged.set(key, { code: warning.code, years: [...warning.years].sort((a, b) => a - b) })
        }
      }
    }
  }

  return [...merged.values()]
}

function warningMessageKey(warning: SalaryWarning): string {
  if (warning.code === "unsupportedHolidayYears") {
    return `${warning.code}:${warning.years.join(",")}`
  }
  return warning.code
}

function WarningAlert({ warning }: { warning: SalaryWarning }) {
  const { t } = useLanguage()

  if (warning.code !== "unsupportedHolidayYears") {
    return null
  }

  return (
    <Alert variant="destructive" className="border-amber-500/50 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100 [&>svg]:text-amber-600">
      <AlertTriangle className="h-4 w-4" aria-hidden />
      <AlertDescription>
        {t("result.warningUnsupportedYears", {
          years: warning.years.join(", "),
          year: AGREEMENT_YEAR,
        })}
      </AlertDescription>
    </Alert>
  )
}

function CalculationBreakdown({
  taxRate,
  shiftYouGive,
  shiftYouTake,
  netDifference,
  grossDifference,
  obDifference,
  diffNetColor,
  diffGrossColor,
  isGain,
  isLoss,
}: {
  taxRate: number
  shiftYouGive: ShiftSwapComparison["shiftYouGive"]
  shiftYouTake: ShiftSwapComparison["shiftYouTake"]
  netDifference: number
  grossDifference: number
  obDifference: number
  diffNetColor: string
  diffGrossColor: string
  isGain: boolean
  isLoss: boolean
}) {
  const { language, t } = useLanguage()
  const hasDiffColor = isGain || isLoss
  const showObDifference = Math.abs(obDifference) >= 50
  const hasObDetails =
    shiftYouTake.obBreakdown.length > 0 || shiftYouGive.obBreakdown.length > 0

  return (
    <div className="text-sm tabular-nums space-y-4">
      <p className="text-muted-foreground text-xs leading-relaxed">
        {t("result.formulaExplain")} {t("result.nettoExplain", { tax: taxRate })}
      </p>

      <table className="w-full">
        <caption className="sr-only">{t("result.howCalculated")}</caption>
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
            obNet={shiftYouTake.obPayNet}
            obGross={shiftYouTake.obPay}
            obLabel={t("result.obOfWhich")}
          />
          <ShiftRow
            label={t("result.giveRow")}
            net={shiftYouGive.netSalary}
            gross={shiftYouGive.grossSalary}
            obNet={shiftYouGive.obPayNet}
            obGross={shiftYouGive.obPay}
            obLabel={t("result.obOfWhich")}
            subtract
          />
          <tr className="border-t card-divider">
            <td className="pt-3 font-semibold">{t("result.diffRow")}</td>
            <td
              className={cn(
                "pt-3 text-right font-bold text-base",
                hasDiffColor && diffNetColor,
              )}
            >
              {formatSignedSek(netDifference)}
            </td>
            <td
              className={cn(
                "pt-3 text-right font-semibold",
                hasDiffColor ? diffGrossColor : "text-muted-foreground",
              )}
            >
              {formatSignedSek(grossDifference)}
            </td>
          </tr>
        </tbody>
      </table>

      {hasObDetails && (
        <ObDetails
          shiftYouTake={shiftYouTake}
          shiftYouTakeLabel={t("result.takeRow")}
          shiftYouGive={shiftYouGive}
          shiftYouGiveLabel={t("result.giveRow")}
          obDifference={obDifference}
          showObDifference={showObDifference}
          language={language}
        />
      )}
    </div>
  )
}

function ShiftRow({
  label,
  net,
  gross,
  obNet,
  obGross,
  obLabel,
  subtract,
}: {
  label: string
  net: number
  gross: number
  obNet: number
  obGross: number
  obLabel: string
  subtract?: boolean
}) {
  const showOb = obGross > 0.005

  return (
    <>
      <tr>
        <td className="py-1.5 text-muted-foreground">
          {subtract ? "− " : ""}
          {label}
        </td>
        <td className="py-1.5 text-right">{formatSek(net)}</td>
        <td className="py-1.5 text-right text-muted-foreground">{formatSek(gross)}</td>
      </tr>
      {showOb && (
        <tr className="text-xs text-muted-foreground">
          <td className="pb-1.5 pl-3">
            {subtract ? "− " : ""}
            {obLabel}
          </td>
          <td className="pb-1.5 text-right">{formatSek(obNet)}</td>
          <td className="pb-1.5 text-right">{formatSek(obGross)}</td>
        </tr>
      )}
    </>
  )
}

function ObDetails({
  shiftYouTake,
  shiftYouTakeLabel,
  shiftYouGive,
  shiftYouGiveLabel,
  obDifference,
  showObDifference,
  language,
}: {
  shiftYouTake: SalaryResult
  shiftYouTakeLabel: string
  shiftYouGive: SalaryResult
  shiftYouGiveLabel: string
  obDifference: number
  showObDifference: boolean
  language: "sv" | "en"
}) {
  const { t } = useLanguage()

  return (
    <details className="group">
      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground list-none flex items-center gap-2">
        <span className="text-[10px] transition-transform group-open:rotate-90" aria-hidden>
          ▶
        </span>
        {t("result.obDetails")}
      </summary>
      <div className="mt-3 space-y-3 pl-3 border-l card-divider">
        <ObBreakdownList
          label={shiftYouTakeLabel}
          items={shiftYouTake.obBreakdown}
          language={language}
        />
        <ObBreakdownList
          label={shiftYouGiveLabel}
          items={shiftYouGive.obBreakdown}
          language={language}
        />
        {showObDifference && (
          <p className="text-xs font-medium text-foreground pt-1 border-t card-divider">
            {t("result.obDifferenceHint", { amount: formatSignedSek(obDifference) })}
          </p>
        )}
      </div>
    </details>
  )
}

function ObBreakdownList({
  label,
  items,
  language,
}: {
  label: string
  items: ObBreakdownItem[]
  language: "sv" | "en"
}) {
  const { t } = useLanguage()

  return (
    <div>
      <p className="text-xs font-medium text-foreground mb-1">{label}</p>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("result.obNone")}</p>
      ) : (
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={`${label}-${item.type}`} className="text-xs text-muted-foreground">
              {item.type}: {formatHoursDuration(item.hours, language)} · {formatSek(item.amount)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
