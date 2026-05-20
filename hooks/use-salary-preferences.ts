"use client"

import { useEffect, useState } from "react"
import { resolveBaseWage, type WageTier, type WorkArea } from "@/lib/handels"

const DEFAULTS = {
  workArea: "Butik" as WorkArea,
  wageTier: "age18" as WageTier,
  customWage: 160.4,
  taxRate: 30,
}

export function useSalaryPreferences() {
  const [workArea, setWorkArea] = useState<WorkArea>(DEFAULTS.workArea)
  const [wageTier, setWageTier] = useState<WageTier>(DEFAULTS.wageTier)
  const [customWage, setCustomWage] = useState(DEFAULTS.customWage)
  const [taxRate, setTaxRate] = useState(DEFAULTS.taxRate)
  const [hydrated, setHydrated] = useState(false)

  const baseWage = resolveBaseWage(workArea, wageTier, customWage)

  useEffect(() => {
    const savedWorkArea = localStorage.getItem("workArea")
    const savedWageTier = localStorage.getItem("wageTier")
    const savedCustomWage = localStorage.getItem("customWage")
    const savedTaxRate = localStorage.getItem("taxRate")

    if (savedWorkArea) setWorkArea(savedWorkArea as WorkArea)
    if (savedWageTier) setWageTier(savedWageTier as WageTier)
    if (savedCustomWage) setCustomWage(Number(savedCustomWage))
    if (savedTaxRate) setTaxRate(Number(savedTaxRate))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("workArea", workArea)
    localStorage.setItem("wageTier", wageTier)
    localStorage.setItem("customWage", customWage.toString())
    localStorage.setItem("taxRate", taxRate.toString())
  }, [workArea, wageTier, customWage, taxRate, hydrated])

  return {
    workArea,
    setWorkArea,
    wageTier,
    setWageTier,
    customWage,
    setCustomWage,
    baseWage,
    taxRate,
    setTaxRate,
  }
}
