"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translate, type Language } from "@passbyte/shared"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
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

  const t = (key: string, vars?: Record<string, string | number>): string =>
    translate(language, key, vars)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export type { Language }
