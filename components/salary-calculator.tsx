"use client"

import { useState } from "react"
import { format } from "date-fns"
import { sv, enUS } from "date-fns/locale"
import { CalendarIcon, HelpCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSalaryPreferences } from "@/hooks/use-salary-preferences"
import { calculateSalary, type SalaryResult, type WorkArea } from "@/lib/handels"
import { useLanguage } from "@/lib/language-context"

export function SalaryCalculator() {
  const { language, t } = useLanguage()
  const { workArea, setWorkArea, baseWage, setBaseWage, taxRate, setTaxRate } = useSalaryPreferences()
  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("17:00")
  const [breakMinutes, setBreakMinutes] = useState(30)
  const [calculationResult, setCalculationResult] = useState<SalaryResult | null>(null)

  const handleCalculate = () => {
    setCalculationResult(
      calculateSalary({
        workArea,
        date,
        startTime,
        endTime,
        breakMinutes,
        baseWage,
        taxRate,
      }),
    )
  }

  const handleClear = () => {
    setStartTime("08:00")
    setEndTime("17:00")
    setBreakMinutes(30)
    setCalculationResult(null)
  }

  const translateWorkArea = (area: WorkArea): string => {
    switch (area) {
      case "Butik":
        return language === "sv" ? "Butik" : "Store"
      case "Lager":
        return language === "sv" ? "Lager" : "Warehouse"
      case "E-handel":
        return language === "sv" ? "E-handel" : "E-commerce"
      default:
        return area
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="bg-[#0a3e41] text-white rounded-t-lg">
          <CardTitle>{t("calculator.title")}</CardTitle>
          <CardDescription className="text-gray-200">{t("calculator.description")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">{t("calculator.workArea")}</h3>
              <RadioGroup
                value={workArea}
                onValueChange={(value) => setWorkArea(value as WorkArea)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Butik" id="butik" />
                  <Label htmlFor="butik">{t("calculator.store")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Lager" id="lager" />
                  <Label htmlFor="lager">{t("calculator.warehouse")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="E-handel" id="e-handel" />
                  <Label htmlFor="e-handel">{t("calculator.ecommerce")}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">{t("calculator.date")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: language === "sv" ? sv : enUS })
                      ) : (
                        <span>{t("calculator.pickDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selected) => selected && setDate(selected)}
                      initialFocus
                      locale={language === "sv" ? sv : enUS}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="break">{t("calculator.break")}</Label>
                <Input
                  id="break"
                  type="number"
                  min="0"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">{t("calculator.startTime")}</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">{t("calculator.endTime")}</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseWage">{t("calculator.baseWage")}</Label>
                <Input
                  id="baseWage"
                  type="number"
                  min="0"
                  step="0.01"
                  value={baseWage}
                  onChange={(e) => setBaseWage(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">{t("calculator.taxRate")}</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>
            <X className="mr-2 h-4 w-4" /> {t("calculator.clear")}
          </Button>
          <Button className="bg-[#E57F66] hover:bg-[#d06c55] text-white" onClick={handleCalculate}>
            {t("calculator.calculate")}
          </Button>
        </CardFooter>
      </Card>

      {calculationResult && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle>{t("result.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{t("result.grossSalary")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-2">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("result.grossSalary.tooltip")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-lg font-bold">{calculationResult.grossSalary.toFixed(2)} SEK</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{t("result.netSalary")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-2">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("result.netSalary.tooltip")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-lg font-bold">{calculationResult.netSalary.toFixed(2)} SEK</span>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">{t("result.details")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t("result.selectedArea")}:</span>
                    <span className="font-medium">{translateWorkArea(workArea)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("result.workedHours")}:</span>
                    <span className="font-medium">
                      {calculationResult.totalHours.toFixed(2)} {language === "sv" ? "timmar" : "hours"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("result.basePay")}:</span>
                    <span className="font-medium">{calculationResult.basePay.toFixed(2)} SEK</span>
                  </div>

                  <h4 className="font-medium mt-3">{t("result.obAdditions")}:</h4>
                  {calculationResult.obBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between pl-4">
                      <span>{item.type}:</span>
                      <span className="font-medium">
                        {item.amount.toFixed(2)} SEK ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
