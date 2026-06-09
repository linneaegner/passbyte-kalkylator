import { colors, radius, spacing } from "@/constants/theme"
import { ChevronDown } from "lucide-react-native"
import { useState, type ReactNode } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

interface CollapsibleProps {
  title: string
  summary: string
  icon?: ReactNode
  children: ReactNode
}

export function Collapsible({ title, summary, icon, children }: CollapsibleProps) {
  const [open, setOpen] = useState(false)

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        {icon}
        <View style={styles.triggerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.summary} numberOfLines={1}>
            {summary}
          </Text>
        </View>
        <ChevronDown
          size={18}
          color={colors.muted}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </Pressable>
      {open ? <View style={styles.content}>{children}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    minHeight: 52,
  },
  triggerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
  },
  summary: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
})
