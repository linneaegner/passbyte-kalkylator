"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex rounded-md border overflow-hidden" role="group" aria-label="Språk">
      <Button
        type="button"
        variant={language === "sv" ? "default" : "ghost"}
        size="sm"
        className="rounded-none h-8 px-3"
        onClick={() => setLanguage("sv")}
        aria-pressed={language === "sv"}
      >
        SV
      </Button>
      <Button
        type="button"
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        className="rounded-none h-8 px-3"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
      >
        EN
      </Button>
    </div>
  )
}
