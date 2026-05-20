"use client"

import { useEffect, useState } from "react"
import type { WorkArea } from "@/lib/handels"

const DEFAULTS = {
  workArea: "Butik" as WorkArea,
  baseWage: 160,
  taxRate: 30,
}

export function useSalaryPreferences() {
  const [workArea, setWorkArea] = useState<WorkArea>(DEFAULTS.workArea)
  const [baseWage, setBaseWage] = useState(DEFAULTS.baseWage)
  const [taxRate, setTaxRate] = useState(DEFAULTS.taxRate)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const savedWorkArea = localStorage.getItem("workArea")
    const savedBaseWage = localStorage.getItem("baseWage")
    const savedTaxRate = localStorage.getItem("taxRate")

    if (savedWorkArea) setWorkArea(savedWorkArea as WorkArea)
    if (savedBaseWage) setBaseWage(Number(savedBaseWage))
    if (savedTaxRate) setTaxRate(Number(savedTaxRate))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("workArea", workArea)
    localStorage.setItem("baseWage", baseWage.toString())
    localStorage.setItem("taxRate", taxRate.toString())
  }, [workArea, baseWage, taxRate, hydrated])

  return {
    workArea,
    setWorkArea,
    baseWage,
    setBaseWage,
    taxRate,
    setTaxRate,
  }
}
