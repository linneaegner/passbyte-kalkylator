import { Card } from "@/components/ui/Card"
import { colors, radius, spacing } from "@/constants/theme"
import { useLanguage } from "@/lib/language-context"
import { formatHoursDuration } from "@passbyte/shared"
import type { ShiftInput } from "@passbyte/handels"
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { format } from "date-fns"
import { sv, enUS } from "date-fns/locale"
import { Calendar, Clock } from "lucide-react-native"
import { useState, type ReactNode } from "react"
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

interface ShiftInputCardProps {
  value: ShiftInput
  onChange: (value: ShiftInput) => void
  hours?: number
}

type PickerKind = "date" | "startTime" | "endTime" | "breakStartTime" | null

function parseTime(value: string): Date {
  const [hourPart, minutePart] = value.split(":")
  const hour = Number(hourPart)
  const minute = Number(minutePart)
  const date = new Date()
  date.setHours(Number.isFinite(hour) ? hour : 0, Number.isFinite(minute) ? minute : 0, 0, 0)
  return date
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

export function ShiftInputCard({ value, onChange, hours }: ShiftInputCardProps) {
  const { language, t } = useLanguage()
  const locale = language === "sv" ? sv : enUS
  const [picker, setPicker] = useState<PickerKind>(null)

  const update = (patch: Partial<ShiftInput>) => onChange({ ...value, ...patch })

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setPicker(null)
    if (event.type === "dismissed" || !selected) return

    if (picker === "date") {
      update({ date: selected })
    } else if (picker === "startTime") {
      update({ startTime: formatTime(selected) })
    } else if (picker === "endTime") {
      update({ endTime: formatTime(selected) })
    } else if (picker === "breakStartTime") {
      update({ breakStartTime: formatTime(selected) })
    }

    if (Platform.OS === "ios") setPicker(null)
  }

  return (
    <Card style={styles.card}>
      <FieldLabel label={t("shift.date")} />
      <PickerButton
        icon={<Calendar size={16} color={colors.primary} />}
        label={format(value.date, "EEE d MMM", { locale })}
        onPress={() => setPicker("date")}
      />

      <View style={styles.row}>
        <View style={styles.col}>
          <FieldLabel label={t("shift.start")} />
          <PickerButton
            icon={<Clock size={16} color={colors.primary} />}
            label={value.startTime}
            onPress={() => setPicker("startTime")}
          />
        </View>
        <View style={styles.col}>
          <FieldLabel label={t("shift.end")} />
          <PickerButton
            icon={<Clock size={16} color={colors.primary} />}
            label={value.endTime}
            onPress={() => setPicker("endTime")}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <FieldLabel label={t("shift.break")} />
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={String(value.breakMinutes)}
            onChangeText={(text) => update({ breakMinutes: Number(text) || 0 })}
          />
        </View>
        <View style={styles.col}>
          <FieldLabel label={t("shift.breakStart")} />
          <PickerButton
            icon={<Clock size={16} color={colors.primary} />}
            label={value.breakStartTime}
            disabled={value.breakMinutes <= 0}
            onPress={() => setPicker("breakStartTime")}
          />
        </View>
      </View>

      {hours !== undefined && hours > 0 && (
        <View style={styles.hoursBadge}>
          <Clock size={14} color={colors.muted} />
          <Text style={styles.hoursText}>{formatHoursDuration(hours, language)}</Text>
        </View>
      )}

      {picker !== null && (
        <DateTimePicker
          value={
            picker === "date"
              ? value.date
              : picker === "startTime"
                ? parseTime(value.startTime)
                : picker === "endTime"
                  ? parseTime(value.endTime)
                  : parseTime(value.breakStartTime)
          }
          mode={picker === "date" ? "date" : "time"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onPickerChange}
        />
      )}
    </Card>
  )
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={styles.label}>{label}</Text>
}

function PickerButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: ReactNode
  label: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.pickerButton, disabled && styles.pickerDisabled]}
    >
      {icon}
      <Text style={styles.pickerText}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
  pickerButton: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pickerDisabled: {
    opacity: 0.5,
  },
  pickerText: {
    fontSize: 16,
    color: colors.foreground,
    fontVariant: ["tabular-nums"],
  },
  input: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  hoursBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    backgroundColor: colors.mutedBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  hoursText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
  },
})
