import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ShiftSwapCalculator } from "@/components/ShiftSwapCalculator"
import { colors, spacing } from "@/constants/theme"
import { AGREEMENT_YEAR } from "@passbyte/handels"
import { useLanguage } from "@/lib/language-context"
import { ArrowRightLeft } from "lucide-react-native"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
  const { t } = useLanguage()

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <ArrowRightLeft size={20} color={colors.primaryForeground} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{t("page.title")}</Text>
              <Text style={styles.subtitle}>{t("page.subtitle")}</Text>
            </View>
          </View>
          <LanguageSwitcher />
        </View>

        <ShiftSwapCalculator />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("footer", { year: AGREEMENT_YEAR })}</Text>
          <Text style={styles.footerPrivacy}>{t("footer.privacy")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minWidth: 0,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  footer: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.primaryForeground,
    opacity: 0.9,
  },
  footerPrivacy: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.primaryForeground,
    opacity: 0.75,
  },
})
