"use client"

import { useEffect, useState } from "react"
import type { WorkArea } from "@/lib/handels"

const DEFAULTS = {
  workArea: "Butik" as WorkArea,
  baseWage: 160.4,
  taxRate: 30,
  swapsPerMonth: 0,
}

export function useSalaryPreferences() {
  const [workArea, setWorkArea] = useState<WorkArea>(DEFAULTS.workArea)
  const [baseWage, setBaseWage] = useState(DEFAULTS.baseWage)
  const [taxRate, setTaxRate] = useState(DEFAULTS.taxRate)
  const [swapsPerMonth, setSwapsPerMonth] = useState(DEFAULTS.swapsPerMonth)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const savedWorkArea = localStorage.getItem("workArea")
    const savedBaseWage = localStorage.getItem("baseWage")
    const savedTaxRate = localStorage.getItem("taxRate")
    const savedSwapsPerMonth = localStorage.getItem("swapsPerMonth")

    if (savedWorkArea) setWorkArea(savedWorkArea as WorkArea)
    if (savedBaseWage) setBaseWage(Number(savedBaseWage))
    if (savedTaxRate) setTaxRate(Number(savedTaxRate))
    if (savedSwapsPerMonth) setSwapsPerMonth(Number(savedSwapsPerMonth))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem("workArea", workArea)
    localStorage.setItem("baseWage", baseWage.toString())
    localStorage.setItem("taxRate", taxRate.toString())
    localStorage.setItem("swapsPerMonth", swapsPerMonth.toString())
  }, [workArea, baseWage, taxRate, swapsPerMonth, hydrated])

  return {
    workArea,
    setWorkArea,
    baseWage,
    setBaseWage,
    taxRate,
    setTaxRate,
    swapsPerMonth,
    setSwapsPerMonth,
  }
}
