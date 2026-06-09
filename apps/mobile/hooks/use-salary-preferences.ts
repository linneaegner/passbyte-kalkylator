import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  isWageTierValidForWorkArea,
  resolveBaseWage,
  type WageTier,
  type WorkArea,
} from "@passbyte/handels"
import { useCallback, useEffect, useState } from "react"

const WORK_AREAS: WorkArea[] = ["Butik", "Lager", "E-handel"]
const ALL_WAGE_TIERS: WageTier[] = [
  "age16",
  "age17",
  "age18",
  "age19",
  "age20",
  "exp1",
  "exp2",
  "exp3",
  "exp6m",
  "custom",
]

const DEFAULTS = {
  workArea: "Butik" as WorkArea,
  wageTier: "age18" as WageTier,
  customWage: 160.4,
  taxRate: 30,
}

export function useSalaryPreferences() {
  const [workArea, setWorkAreaState] = useState<WorkArea>(DEFAULTS.workArea)
  const [wageTier, setWageTier] = useState<WageTier>(DEFAULTS.wageTier)
  const [customWage, setCustomWage] = useState(DEFAULTS.customWage)
  const [taxRate, setTaxRate] = useState(DEFAULTS.taxRate)
  const [hydrated, setHydrated] = useState(false)

  const baseWage = resolveBaseWage(workArea, wageTier, customWage)

  const setWorkArea = useCallback((area: WorkArea) => {
    setWorkAreaState(area)
    setWageTier((prev) => {
      if (prev === "custom" || isWageTierValidForWorkArea(area, prev)) return prev
      return "age18"
    })
  }, [])

  useEffect(() => {
    async function load() {
      const [savedWorkArea, savedWageTier, savedCustomWage, savedTaxRate] =
        await Promise.all([
          AsyncStorage.getItem("workArea"),
          AsyncStorage.getItem("wageTier"),
          AsyncStorage.getItem("customWage"),
          AsyncStorage.getItem("taxRate"),
        ])

      const area =
        savedWorkArea && WORK_AREAS.includes(savedWorkArea as WorkArea)
          ? (savedWorkArea as WorkArea)
          : DEFAULTS.workArea

      if (savedWorkArea && WORK_AREAS.includes(savedWorkArea as WorkArea)) {
        setWorkAreaState(area)
      }
      if (
        savedWageTier &&
        ALL_WAGE_TIERS.includes(savedWageTier as WageTier) &&
        isWageTierValidForWorkArea(area, savedWageTier as WageTier)
      ) {
        setWageTier(savedWageTier as WageTier)
      }
      if (savedCustomWage) {
        const wage = Number(savedCustomWage)
        if (Number.isFinite(wage) && wage >= 0) setCustomWage(wage)
      }
      if (savedTaxRate) {
        const tax = Number(savedTaxRate)
        if (Number.isFinite(tax) && tax >= 0 && tax <= 100) setTaxRate(tax)
      }
      setHydrated(true)
    }
    void load()
  }, [])

  useEffect(() => {
    if (!hydrated) return
    void AsyncStorage.multiSet([
      ["workArea", workArea],
      ["wageTier", wageTier],
      ["customWage", customWage.toString()],
      ["taxRate", taxRate.toString()],
    ])
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
