import AsyncStorage from "@react-native-async-storage/async-storage"
import { translate, type Language } from "@passbyte/shared"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("sv")

  useEffect(() => {
    AsyncStorage.getItem("language").then((saved) => {
      if (saved === "sv" || saved === "en") setLanguageState(saved)
    })
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    void AsyncStorage.setItem("language", newLanguage)
  }

  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(language, key, vars)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}

export type { Language }
