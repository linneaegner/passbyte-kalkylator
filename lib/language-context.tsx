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
    "result.gainLead": "Du tjänar",
    "result.gainTrail": "extra på bytet",
    "result.lossLead": "Bytet kostar dig",
    "result.sameHeadline": "Lönen blir densamma",
    "result.compareHint": "jämfört med att behålla ditt pass",
    "result.hoursMore": "Passet du tar är {hours} längre",
    "result.hoursLess": "Passet du tar är {hours} kortare",
    "result.howCalculated": "Så räknas det",
    "result.formulaExplain":
      "Vi räknar ut lönen för båda passen och tar skillnaden — ungefär som om du byter det ena mot det andra.",
    "result.nettoExplain":
      "Netto är lön efter skatt (det som ungefär hamnar på kontot). Brutto är lön före skatt. Här använder vi {tax}% skatt, samma som du angav ovan.",
    "result.afterTax": "Efter skatt",
    "result.beforeTax": "Före skatt",
    "result.takeRow": "Pass du tar",
    "result.giveRow": "Pass du lämnar",
    "result.diffRow": "Skillnad",
    "footer":
      "Baserat på Handels avtal butik, lager och e-handel ({year}). Kontrollera alltid din lönespecifikation och lokala avtal. Verktyget är inte officiellt kopplat till Handels. Vi reserverar oss för eventuella fel.",
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
    "result.gainLead": "You earn",
    "result.gainTrail": "extra from the swap",
    "result.lossLead": "The swap costs you",
    "result.sameHeadline": "Same pay either way",
    "result.compareHint": "compared to keeping your shift",
    "result.hoursMore": "The shift you take is {hours} longer",
    "result.hoursLess": "The shift you take is {hours} shorter",
    "result.howCalculated": "How it's calculated",
    "result.formulaExplain":
      "We calculate pay for both shifts and take the difference — as if you swap one for the other.",
    "result.nettoExplain":
      "Net is pay after tax (roughly what lands in your account). Gross is pay before tax. We use {tax}% tax here, same as you entered above.",
    "result.afterTax": "After tax",
    "result.beforeTax": "Before tax",
    "result.takeRow": "Shift you take",
    "result.giveRow": "Shift you give away",
    "result.diffRow": "Difference",
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
