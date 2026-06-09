import { colors, radius, spacing } from "@/constants/theme"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

interface OptionPickerProps<T extends string> {
  visible: boolean
  title: string
  options: { value: T; label: string }[]
  selected: T
  onSelect: (value: T) => void
  onClose: () => void
}

export function OptionPicker<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionPickerProps<T>) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView>
          {options.map((option) => {
            const active = option.value === selected
            return (
              <Pressable
                key={option.value}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => {
                  onSelect(option.value)
                  onClose()
                }}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: "60%",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionActive: {
    backgroundColor: colors.primaryMuted,
  },
  optionText: {
    fontSize: 16,
    color: colors.foreground,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
})
