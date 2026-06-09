import { SettingsPanel } from "@/components/SettingsPanel"
import { ShiftInputCard } from "@/components/ShiftInputCard"
import { StepHeader } from "@/components/StepHeader"
import { SwapComparisonResult } from "@/components/SwapComparisonResult"
import { colors, radius, spacing } from "@/constants/theme"
import { useSalaryPreferences } from "@/hooks/use-salary-preferences"
import { useLanguage } from "@/lib/language-context"
import { compareShiftSwap, type ShiftInput } from "@passbyte/handels"
import { ArrowRightLeft } from "lucide-react-native"
import { useMemo, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"

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
  return { ...defaultShiftTimes, date: addDays(startOfToday(), 2) }
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

  const handleSwap = () => {
    setShiftGive(shiftTake)
    setShiftTake(shiftGive)
  }

  return (
    <View style={styles.container}>
      <SettingsPanel
        workArea={prefs.workArea}
        setWorkArea={prefs.setWorkArea}
        wageTier={prefs.wageTier}
        setWageTier={prefs.setWageTier}
        customWage={prefs.customWage}
        setCustomWage={prefs.setCustomWage}
        baseWage={prefs.baseWage}
        taxRate={prefs.taxRate}
        setTaxRate={prefs.setTaxRate}
      />

      <View style={styles.section}>
        <StepHeader step={1} title={t("shift.give")} />
        <ShiftInputCard
          value={shiftGive}
          onChange={setShiftGive}
          hours={comparison.shiftYouGive.totalHours}
        />
      </View>

      <Pressable
        onPress={handleSwap}
        style={styles.swapButton}
        accessibilityRole="button"
        accessibilityLabel={t("step.swap")}
      >
        <ArrowRightLeft size={20} color={colors.primary} />
      </Pressable>

      <View style={styles.section}>
        <StepHeader step={2} title={t("shift.take")} />
        <ShiftInputCard
          value={shiftTake}
          onChange={setShiftTake}
          hours={comparison.shiftYouTake.totalHours}
        />
      </View>

      <SwapComparisonResult comparison={comparison} taxRate={prefs.taxRate} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  swapButton: {
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
})
