"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { ShiftSwapCalculator } from "@/components/shift-swap-calculator"
import { AGREEMENT_YEAR } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen py-6 px-4">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0a3e41]">{t("page.title")}</h1>
          <LanguageSwitcher />
        </header>

        <ShiftSwapCalculator />
      </div>

      <footer className="bg-[#0a3e41] text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-sm">{t("footer", { year: AGREEMENT_YEAR })}</p>
        </div>
      </footer>
    </main>
  )
}
