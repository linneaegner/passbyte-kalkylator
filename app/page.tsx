"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { ShiftSwapCalculator } from "@/components/shift-swap-calculator"
import { AGREEMENT_YEAR } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"
import { ArrowRightLeft } from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-5 px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <header className="mb-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <ArrowRightLeft className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-primary truncate">
                    {t("page.title")}
                  </h1>
                  <p className="text-sm text-muted-foreground">{t("page.subtitle")}</p>
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </header>

          <ShiftSwapCalculator />
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-4 px-4 mt-auto">
        <p className="text-xs text-center max-w-lg mx-auto opacity-90 leading-relaxed">
          {t("footer", { year: AGREEMENT_YEAR })}
        </p>
      </footer>
    </div>
  )
}
