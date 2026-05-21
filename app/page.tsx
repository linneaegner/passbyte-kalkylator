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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {t("a11y.skipToContent")}
      </a>
      <main id="main-content" className="flex-1 py-5 px-4 sm:px-6 pb-8 md:py-8">
        <div className="max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto w-full">
          <header className="mb-5 md:mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_14px_hsl(186_65%_15%/0.22)]">
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
        <p className="text-xs text-center max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto opacity-90 leading-relaxed">
          {t("footer", { year: AGREEMENT_YEAR })}
        </p>
      </footer>
    </div>
  )
}
