"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "sv" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const translations = {
  sv: {
    "page.title": "Passbyte",
    "settings.workArea": "Arbetsområde",
    "settings.store": "Butik",
    "settings.warehouse": "Lager",
    "settings.ecommerce": "E-handel",
    "settings.wageTier": "Lön enligt avtal (april 2026)",
    "settings.wageCustom": "Egen timlön",
    "settings.wage": "Timlön (kr)",
    "settings.wageFromAgreement": "Timlön",
    "settings.tax": "Ungefärlig skatt (%)",
    "shift.give": "Pass du lämnar",
    "shift.take": "Pass du tar",
    "shift.date": "Datum",
    "shift.start": "Starttid",
    "shift.end": "Sluttid",
    "shift.break": "Rast (minuter)",
    "shift.breakStart": "Rast börjar",
    "result.more": "Du får {amount} mer i netto",
    "result.less": "Du får {amount} mindre i netto",
    "result.same": "Samma nettolön",
    "result.nettoHint": "jämfört med om du behåller ditt pass",
    "result.howCalculated": "Så räknas det",
    "result.formulaExplain": "Netto för passet du tar, minus netto för passet du lämnar.",
    "result.takeRow": "Pass du tar",
    "result.giveRow": "Pass du lämnar",
    "result.diffRow": "Skillnad",
    "footer":
      "Handelsavtal {year}. Kontrollera lönespec. Uppskattad skatt.",
  },
  en: {
    "page.title": "Shift swap",
    "settings.workArea": "Work area",
    "settings.store": "Store",
    "settings.warehouse": "Warehouse",
    "settings.ecommerce": "E-commerce",
    "settings.wageTier": "Agreement wage (April 2026)",
    "settings.wageCustom": "Custom hourly wage",
    "settings.wage": "Hourly wage (SEK)",
    "settings.wageFromAgreement": "Hourly wage",
    "settings.tax": "Approx. tax rate (%)",
    "shift.give": "Shift you give away",
    "shift.take": "Shift you take",
    "shift.date": "Date",
    "shift.start": "Start time",
    "shift.end": "End time",
    "shift.break": "Break (minutes)",
    "shift.breakStart": "Break starts",
    "result.more": "You get {amount} more net",
    "result.less": "You get {amount} less net",
    "result.same": "Same net pay",
    "result.nettoHint": "compared to keeping your shift",
    "result.howCalculated": "How it's calculated",
    "result.formulaExplain": "Net pay for the shift you take, minus net pay for the shift you give away.",
    "result.takeRow": "Shift you take",
    "result.giveRow": "Shift you give away",
    "result.diffRow": "Difference",
    "footer":
      "Handels agreement {year}. Check payslip. Estimated tax.",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("sv")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage === "sv" || savedLanguage === "en") {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let text = translations[language][key as keyof (typeof translations)["sv"]] || key
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replace(`{${name}}`, String(value))
      }
    }
    return text
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
