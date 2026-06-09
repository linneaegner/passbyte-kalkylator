import { colors, radius, spacing } from "@/constants/theme"
import { useLanguage } from "@/lib/language-context"
import { Pressable, StyleSheet, Text, View } from "react-native"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <View style={styles.wrapper} accessibilityLabel={t("language.label")}>
      {(["sv", "en"] as const).map((lang) => (
        <Pressable
          key={lang}
          onPress={() => setLanguage(lang)}
          style={[styles.button, language === lang && styles.buttonActive]}
          accessibilityRole="button"
          accessibilityState={{ selected: language === lang }}
        >
          <Text style={[styles.text, language === lang && styles.textActive]}>
            {lang.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 44,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  textActive: {
    color: colors.primaryForeground,
  },
})
