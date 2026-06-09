import { StepHeader } from "@/components/StepHeader"
import { Card } from "@/components/ui/Card"
import { colors, radius, spacing } from "@/constants/theme"
import { useLanguage } from "@/lib/language-context"
import { formatHoursDuration, formatSignedSek, formatSek } from "@passbyte/shared"
import {
  AGREEMENT_YEAR,
  type ObBreakdownItem,
  type SalaryWarning,
  type ShiftSwapComparison,
} from "@passbyte/handels"
import { AlertTriangle, Clock } from "lucide-react-native"
import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

interface SwapComparisonResultProps {
  comparison: ShiftSwapComparison
  taxRate: number
}

export function SwapComparisonResult({ comparison, taxRate }: SwapComparisonResultProps) {
  const { language, t } = useLanguage()
  const [showCalc, setShowCalc] = useState(false)
  const [showOb, setShowOb] = useState(false)

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

  const verdictStyle = isGain
    ? styles.verdictGain
    : isLoss
      ? styles.verdictLoss
      : styles.verdictNeutral

  const diffColor = isGain
    ? styles.gainText
    : isLoss
      ? styles.lossText
      : styles.neutralText

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
  const hasObDetails =
    shiftYouTake.obBreakdown.length > 0 || shiftYouGive.obBreakdown.length > 0
  const showObDifference = Math.abs(obDifference) >= 50

  return (
    <View style={styles.section}>
      <StepHeader step={3} title={t("step.result.title")} />

      {warnings.map((warning) => (
        <WarningAlert key={warningMessageKey(warning)} warning={warning} />
      ))}

      <Card>
        <View style={[styles.verdictHeader, verdictStyle]}>
          {isGain || isLoss ? (
            <>
              <Text style={styles.verdictLead}>
                {isGain ? t("result.gainLead") : t("result.lossLead")}
              </Text>
              <Text style={[styles.verdictAmount, diffColor]}>
                {formatSignedSek(isGain ? absAmount : -absAmount)}
              </Text>
              {isGain && <Text style={styles.verdictTrail}>{t("result.gainTrail")}</Text>}
              <Text style={styles.verdictHint}>{t("result.compareHint")}</Text>
            </>
          ) : (
            <>
              <Text style={styles.sameHeadline}>{t("result.sameHeadline")}</Text>
              <Text style={styles.verdictHint}>{t("result.compareHint")}</Text>
            </>
          )}

          {hoursHint && (
            <View style={styles.hoursHint}>
              <Clock size={16} color={colors.primary} />
              <Text style={styles.hoursHintText}>{hoursHint}</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Pressable onPress={() => setShowCalc((v) => !v)} style={styles.detailsToggle}>
            <Text style={styles.detailsToggleIcon}>{showCalc ? "▼" : "▶"}</Text>
            <Text style={styles.detailsToggleText}>{t("result.howCalculated")}</Text>
          </Pressable>

          {showCalc && (
            <View style={styles.breakdown}>
              <Text style={styles.formulaHint}>
                {t("result.formulaExplain")} {t("result.nettoExplain", { tax: taxRate })}
              </Text>

              <BreakdownHeader />
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
              <View style={[styles.row, styles.diffRow]}>
                <Text style={styles.diffLabel}>{t("result.diffRow")}</Text>
                <Text style={[styles.diffNet, diffColor]}>{formatSignedSek(netDifference)}</Text>
                <Text style={[styles.diffGross, diffColor]}>
                  {formatSignedSek(grossDifference)}
                </Text>
              </View>

              {hasObDetails && (
                <>
                  <Pressable onPress={() => setShowOb((v) => !v)} style={styles.detailsToggle}>
                    <Text style={styles.detailsToggleIcon}>{showOb ? "▼" : "▶"}</Text>
                    <Text style={styles.detailsToggleText}>{t("result.obDetails")}</Text>
                  </Pressable>
                  {showOb && (
                    <View style={styles.obSection}>
                      <ObBreakdownList
                        label={t("result.takeRow")}
                        items={shiftYouTake.obBreakdown}
                        language={language}
                      />
                      <ObBreakdownList
                        label={t("result.giveRow")}
                        items={shiftYouGive.obBreakdown}
                        language={language}
                      />
                      {showObDifference && (
                        <Text style={styles.obDiffHint}>
                          {t("result.obDifferenceHint", {
                            amount: formatSignedSek(obDifference),
                          })}
                        </Text>
                      )}
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </Card>
    </View>
  )
}

function BreakdownHeader() {
  const { t } = useLanguage()
  return (
    <View style={styles.row}>
      <Text style={[styles.colLabel, styles.headerCell]} />
      <Text style={[styles.colNet, styles.headerCell]}>{t("result.afterTax")}</Text>
      <Text style={[styles.colGross, styles.headerCell]}>{t("result.beforeTax")}</Text>
    </View>
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
  const prefix = subtract ? "− " : ""

  return (
    <>
      <View style={styles.row}>
        <Text style={styles.colLabel}>
          {prefix}
          {label}
        </Text>
        <Text style={styles.colNet}>{formatSek(net)}</Text>
        <Text style={styles.colGross}>{formatSek(gross)}</Text>
      </View>
      {showOb && (
        <View style={styles.row}>
          <Text style={styles.obRowLabel}>
            {prefix}
            {obLabel}
          </Text>
          <Text style={styles.obRowValue}>{formatSek(obNet)}</Text>
          <Text style={styles.obRowValue}>{formatSek(obGross)}</Text>
        </View>
      )}
    </>
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
    <View style={styles.obList}>
      <Text style={styles.obListTitle}>{label}</Text>
      {items.length === 0 ? (
        <Text style={styles.obNone}>{t("result.obNone")}</Text>
      ) : (
        items.map((item) => (
          <Text key={`${label}-${item.type}`} style={styles.obItem}>
            {item.type}: {formatHoursDuration(item.hours, language)} · {formatSek(item.amount)}
          </Text>
        ))
      )}
    </View>
  )
}

function WarningAlert({ warning }: { warning: SalaryWarning }) {
  const { t } = useLanguage()
  if (warning.code !== "unsupportedHolidayYears") return null

  return (
    <View style={styles.warning}>
      <AlertTriangle size={16} color={colors.warningBorder} />
      <Text style={styles.warningText}>
        {t("result.warningUnsupportedYears", {
          years: warning.years.join(", "),
          year: AGREEMENT_YEAR,
        })}
      </Text>
    </View>
  )
}

function mergeWarnings(...groups: SalaryWarning[][]): SalaryWarning[] {
  const merged = new Map<string, SalaryWarning>()
  for (const group of groups) {
    for (const warning of group) {
      if (warning.code === "unsupportedHolidayYears") {
        const existing = merged.get(warning.code)
        if (existing?.code === "unsupportedHolidayYears") {
          const years = [...new Set([...existing.years, ...warning.years])].sort((a, b) => a - b)
          merged.set(warning.code, { code: warning.code, years })
        } else {
          merged.set(warning.code, { code: warning.code, years: [...warning.years].sort((a, b) => a - b) })
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

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  verdictHeader: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  verdictGain: {
    backgroundColor: colors.verdictGain,
  },
  verdictLoss: {
    backgroundColor: colors.verdictLoss,
  },
  verdictNeutral: {
    backgroundColor: colors.verdictNeutral,
  },
  verdictLead: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.foreground,
  },
  verdictAmount: {
    fontSize: 40,
    fontWeight: "700",
    marginTop: spacing.xs,
    fontVariant: ["tabular-nums"],
  },
  verdictTrail: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.foreground,
    marginTop: spacing.xs,
  },
  verdictHint: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.sm,
  },
  sameHeadline: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.foreground,
  },
  hoursHint: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  hoursHintText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
  },
  body: {
    padding: spacing.xl,
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailsToggleIcon: {
    fontSize: 10,
    color: colors.muted,
  },
  detailsToggleText: {
    fontSize: 14,
    color: colors.muted,
  },
  breakdown: {
    gap: spacing.sm,
  },
  formulaHint: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCell: {
    fontSize: 12,
    color: colors.muted,
    paddingBottom: spacing.sm,
  },
  colLabel: {
    flex: 1.2,
    fontSize: 14,
    color: colors.muted,
    paddingVertical: 6,
  },
  colNet: {
    flex: 1,
    fontSize: 14,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
    paddingVertical: 6,
  },
  colGross: {
    flex: 1,
    fontSize: 14,
    textAlign: "right",
    color: colors.muted,
    fontVariant: ["tabular-nums"],
    paddingVertical: 6,
  },
  obRowLabel: {
    flex: 1.2,
    fontSize: 12,
    color: colors.muted,
    paddingLeft: spacing.md,
    paddingVertical: 2,
  },
  obRowValue: {
    flex: 1,
    fontSize: 12,
    textAlign: "right",
    color: colors.muted,
    fontVariant: ["tabular-nums"],
    paddingVertical: 2,
  },
  diffRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  diffLabel: {
    flex: 1.2,
    fontSize: 14,
    fontWeight: "600",
  },
  diffNet: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  diffGross: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  obSection: {
    marginTop: spacing.sm,
    paddingLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    gap: spacing.md,
  },
  obList: {
    gap: spacing.xs,
  },
  obListTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.foreground,
  },
  obNone: {
    fontSize: 12,
    color: colors.muted,
  },
  obItem: {
    fontSize: 12,
    color: colors.muted,
  },
  obDiffHint: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.foreground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  warning: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.warningText,
    lineHeight: 20,
  },
  gainText: {
    color: colors.verdictGainText,
  },
  lossText: {
    color: colors.verdictLossText,
  },
  neutralText: {
    color: colors.foreground,
  },
})
