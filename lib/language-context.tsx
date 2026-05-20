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
    "page.subtitle": "Är bytet värt det?",
    "settings.title": "Dina inställningar",
    "settings.summary": "{area} · {wage}/tim · {tax}% skatt",
    "settings.workArea": "Var jobbar du?",
    "settings.store": "Butik",
    "settings.warehouse": "Lager",
    "settings.ecommerce": "E-handel",
    "settings.wageTier": "Lön",
    "settings.wageCustom": "Egen timlön",
    "settings.wage": "Timlön (kr)",
    "settings.wageFromAgreement": "Timlön",
    "settings.wagePerHour": "/tim",
    "settings.tax": "Skatt (%)",
    "wageTier.age16": "16 år",
    "wageTier.age17": "17 år",
    "wageTier.age18": "18 år",
    "wageTier.age19": "19 år",
    "wageTier.exp1": "1 års branschvana (18+)",
    "wageTier.exp2": "2 års branschvana",
    "wageTier.exp3": "3 års branschvana",
    "shift.give": "Pass du lämnar",
    "shift.take": "Pass du tar",
    "shift.date": "Datum",
    "shift.start": "Starttid",
    "shift.end": "Sluttid",
    "shift.break": "Rast (minuter)",
    "shift.breakStart": "Rast börjar",
    "shift.done": "Klar",
    "result.gainLead": "Du tjänar",
    "result.scrollToDetails": "Visa resultat i detalj",
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
    "result.details": "Detaljer",
    "result.give": "Lämnar",
    "result.take": "Tar",
    "result.net": "Netto",
    "result.gross": "Brutto",
    "result.ob": "OB",
    "result.summary": "Brutto {gross} · OB {ob}",
    "result.workedHours": "Arbetade timmar",
    "result.basePay": "Grundlön",
    "result.obAdditions": "OB-tillägg",
    "footer":
      "Baserat på Handels avtal butik, lager och e-handel ({year}). Kontrollera alltid din lönespecifikation och lokala avtal. Verktyget är inte officiellt kopplat till Handels. Vi reserverar oss för eventuella fel.",
    "language.label": "Språk",
  },
  en: {
    "page.title": "Shift swap",
    "page.subtitle": "Is the swap worth it?",
    "settings.title": "Your settings",
    "settings.summary": "{area} · {wage}/hr · {tax}% tax",
    "settings.workArea": "Where do you work?",
    "settings.store": "Store",
    "settings.warehouse": "Warehouse",
    "settings.ecommerce": "E-commerce",
    "settings.wageTier": "Wage",
    "settings.wageCustom": "Custom hourly wage",
    "settings.wage": "Hourly wage (SEK)",
    "settings.wageFromAgreement": "Hourly wage",
    "settings.wagePerHour": "/hr",
    "settings.tax": "Tax (%)",
    "wageTier.age16": "Age 16",
    "wageTier.age17": "Age 17",
    "wageTier.age18": "Age 18",
    "wageTier.age19": "Age 19",
    "wageTier.exp1": "1 year experience (18+)",
    "wageTier.exp2": "2 years experience",
    "wageTier.exp3": "3 years experience",
    "shift.give": "Giving away",
    "shift.take": "Taking",
    "shift.date": "Date",
    "shift.start": "Start",
    "shift.end": "End",
    "shift.break": "Break (min)",
    "shift.breakStart": "Break at",
    "shift.done": "Done",
    "result.gainLead": "You earn",
    "result.scrollToDetails": "Show full result",
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
    "result.takeRow": "Taking",
    "result.giveRow": "Giving away",
    "result.diffRow": "Difference",
    "result.details": "Details",
    "result.give": "Give",
    "result.take": "Take",
    "result.net": "Net",
    "result.gross": "Gross",
    "result.ob": "OB",
    "result.summary": "Gross {gross} · OB {ob}",
    "result.workedHours": "Worked hours",
    "result.basePay": "Base pay",
    "result.obAdditions": "OB additions",
    "footer":
      "Based on the Handels retail, warehouse and e-commerce agreement ({year}). Always check your payslip and local agreements. This tool is not officially affiliated with Handels. We disclaim responsibility for any errors.",
    "language.label": "Language",
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
