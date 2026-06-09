import { Collapsible } from "@/components/ui/Collapsible"
import { OptionPicker } from "@/components/ui/OptionPicker"
import { colors, radius, spacing } from "@/constants/theme"
import { useLanguage } from "@/lib/language-context"
import { formatSek } from "@passbyte/shared"
import { getWageTiersForWorkArea, type WageTier, type WorkArea } from "@passbyte/handels"
import { ChevronDown, Settings2 } from "lucide-react-native"
import { useMemo, useState } from "react"
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"

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

export function SettingsPanel(props: SettingsPanelProps) {
  const { t } = useLanguage()
  const [wagePickerOpen, setWagePickerOpen] = useState(false)

  const {
    workArea,
    setWorkArea,
    wageTier,
    setWageTier,
    customWage,
    setCustomWage,
    baseWage,
    taxRate,
    setTaxRate,
  } = props

  const workAreaLabel = WORK_AREAS.find((a) => a.value === workArea)
  const wageTiers = getWageTiersForWorkArea(workArea)
  const wageLabel =
    wageTier === "custom" ? formatSek(customWage) : t(`wageTier.${wageTier}`)
  const summary = t("settings.summary", {
    area: workAreaLabel ? t(workAreaLabel.labelKey) : workArea,
    wage: wageLabel,
    tax: taxRate,
  })

  const wageOptions = useMemo(
    () => [
      ...wageTiers.map((tier) => ({ value: tier, label: t(`wageTier.${tier}`) })),
      { value: "custom" as WageTier, label: t("settings.wageCustom") },
    ],
    [wageTiers, t],
  )

  return (
    <>
      <Collapsible
        title={t("settings.title")}
        summary={summary}
        icon={
          <View style={styles.iconBox}>
            <Settings2 size={16} color={colors.primary} />
          </View>
        }
      >
        <Text style={styles.label}>{t("settings.workArea")}</Text>
        <View style={styles.areaRow}>
          {WORK_AREAS.map(({ value, labelKey }) => {
            const active = workArea === value
            return (
              <Pressable
                key={value}
                onPress={() => setWorkArea(value)}
                style={[styles.areaButton, active && styles.areaButtonActive]}
              >
                <Text style={[styles.areaText, active && styles.areaTextActive]}>
                  {t(labelKey)}
                </Text>
              </Pressable>
            )
          })}
        </View>

        <Text style={styles.label}>{t("settings.wageTier")}</Text>
        <Pressable style={styles.select} onPress={() => setWagePickerOpen(true)}>
          <Text style={styles.selectText}>
            {wageTier === "custom" ? t("settings.wageCustom") : t(`wageTier.${wageTier}`)}
          </Text>
          <ChevronDown size={18} color={colors.muted} />
        </Pressable>

        {wageTier === "custom" ? (
          <View>
            <Text style={styles.label}>{t("settings.wage")}</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={String(customWage)}
              onChangeText={(text) => setCustomWage(Number(text) || 0)}
            />
          </View>
        ) : (
          <Text style={styles.hint}>
            {t("settings.wageFromAgreement")}: {formatSek(baseWage)}
            {t("settings.wagePerHour")}
          </Text>
        )}

        <View>
          <Text style={styles.label}>{t("settings.tax")}</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={String(taxRate)}
            onChangeText={(text) => setTaxRate(Number(text) || 0)}
          />
        </View>
      </Collapsible>

      <OptionPicker
        visible={wagePickerOpen}
        title={t("settings.wageTier")}
        options={wageOptions}
        selected={wageTier}
        onSelect={setWageTier}
        onClose={() => setWagePickerOpen(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  areaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  areaButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  areaButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  areaText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.foreground,
    textAlign: "center",
  },
  areaTextActive: {
    color: colors.primaryForeground,
  },
  select: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  selectText: {
    fontSize: 16,
    color: colors.foreground,
  },
  input: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: spacing.lg,
  },
  hint: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
})
