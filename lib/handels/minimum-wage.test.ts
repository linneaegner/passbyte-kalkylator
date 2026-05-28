import { describe, expect, it } from "vitest"
import {
  getMinimumWage,
  getWageTiersForWorkArea,
  isWageTierValidForWorkArea,
  resolveBaseWage,
} from "./minimum-wage"

describe("minimum-wage", () => {
  it("returnerar butikslöner enligt avtal april 2026", () => {
    expect(getMinimumWage("Butik", "age16")).toBe(104.36)
    expect(getMinimumWage("Butik", "exp3")).toBe(175.64)
  })

  it("returnerar lager/e-handel-löner enligt avtal april 2026", () => {
    expect(getMinimumWage("Lager", "age16")).toBe(105.55)
    expect(getMinimumWage("E-handel", "age20")).toBe(167.75)
    expect(getMinimumWage("Lager", "exp6m")).toBe(170.86)
  })

  it("skiljer på tillgängliga lönesteg per arbetsområde", () => {
    expect(getWageTiersForWorkArea("Butik")).toContain("exp1")
    expect(getWageTiersForWorkArea("Butik")).not.toContain("age20")
    expect(getWageTiersForWorkArea("Lager")).toContain("age20")
    expect(getWageTiersForWorkArea("Lager")).not.toContain("exp1")
  })

  it("validerar lönesteg mot arbetsområde", () => {
    expect(isWageTierValidForWorkArea("Butik", "exp2")).toBe(true)
    expect(isWageTierValidForWorkArea("Butik", "exp6m")).toBe(false)
    expect(isWageTierValidForWorkArea("Lager", "exp6m")).toBe(true)
    expect(isWageTierValidForWorkArea("Lager", "exp1")).toBe(false)
  })

  it("använder egen timlön när custom valts", () => {
    expect(resolveBaseWage("Lager", "custom", 200)).toBe(200)
  })
})
