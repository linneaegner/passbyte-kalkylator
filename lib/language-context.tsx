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
    "settings.workArea": "Område",
    "settings.store": "Butik",
    "settings.warehouse": "Lager",
    "settings.ecommerce": "E-handel",
    "settings.wage": "Timlön (kr)",
    "settings.tax": "Skatt (%)",
    "settings.swaps": "Byten/månad",
    "shift.give": "Lämnar",
    "shift.take": "Tar",
    "shift.date": "Datum",
    "shift.pickDate": "Välj datum",
    "shift.start": "Start",
    "shift.end": "Slut",
    "shift.break": "Rast (min)",
    "result.perSwap": "per byte",
    "result.gain": "Du tjänar",
    "result.loss": "Du förlorar",
    "result.same": "Samma lön",
    "result.monthly": "{amount}/mån vid {count} byten",
    "result.details": "Detaljer",
    "result.give": "Lämnar",
    "result.take": "Tar",
    "result.net": "Netto",
    "result.ob": "OB",
    "footer":
      "Baserat på Handels avtal butik, lager och e-handel ({year}). Kontrollera alltid din lönespecifikation och lokala avtal. Verktyget är inte officiellt kopplat till Handels. Vi reserverar oss för eventuella fel.",
  },
  en: {
    "page.title": "Shift swap",
    "settings.workArea": "Area",
    "settings.store": "Store",
    "settings.warehouse": "Warehouse",
    "settings.ecommerce": "E-commerce",
    "settings.wage": "Hourly wage (SEK)",
    "settings.tax": "Tax (%)",
    "settings.swaps": "Swaps/month",
    "shift.give": "Give",
    "shift.take": "Take",
    "shift.date": "Date",
    "shift.pickDate": "Pick date",
    "shift.start": "Start",
    "shift.end": "End",
    "shift.break": "Break (min)",
    "result.perSwap": "per swap",
    "result.gain": "You gain",
    "result.loss": "You lose",
    "result.same": "Same pay",
    "result.monthly": "{amount}/mo at {count} swaps",
    "result.details": "Details",
    "result.give": "Give",
    "result.take": "Take",
    "result.net": "Net",
    "result.ob": "OB",
    "footer":
      "Based on the Handels retail, warehouse and e-commerce agreement ({year}). Always check your payslip and local agreements. This tool is not officially affiliated with Handels. We disclaim responsibility for any errors.",
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
