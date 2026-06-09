import { colors, radius, spacing } from "@/constants/theme"
import { StyleSheet, Text, View } from "react-native"

interface StepHeaderProps {
  step: number
  title: string
}

export function StepHeader({ step, title }: StepHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{step}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm + 2,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.primaryForeground,
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
  },
})
