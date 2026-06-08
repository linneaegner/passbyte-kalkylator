"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex rounded-lg border overflow-hidden shrink-0" role="group" aria-label={t("language.label")}>
      <Button
        type="button"
        variant={language === "sv" ? "default" : "ghost"}
        size="sm"
        className="rounded-none h-9 min-w-[40px] px-3"
        onClick={() => setLanguage("sv")}
        aria-pressed={language === "sv"}
      >
        SV
      </Button>
      <Button
        type="button"
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        className="rounded-none h-9 min-w-[40px] px-3"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
      >
        EN
      </Button>
    </div>
  )
}
