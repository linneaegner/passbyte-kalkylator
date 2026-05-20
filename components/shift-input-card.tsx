"use client"

import { format } from "date-fns"
import { sv, enUS } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/lib/language-context"
import type { ShiftInput } from "@/lib/handels"

interface ShiftInputCardProps {
  title: string
  value: ShiftInput
  onChange: (value: ShiftInput) => void
}

export function ShiftInputCard({ title, value, onChange }: ShiftInputCardProps) {
  const { language, t } = useLanguage()
  const locale = language === "sv" ? sv : enUS
  const update = (patch: Partial<ShiftInput>) => onChange({ ...value, ...patch })

  return (
    <fieldset className="rounded-lg border bg-card p-4 space-y-3">
      <legend className="text-sm font-semibold text-[#0a3e41] px-1">{title}</legend>

      <div className="space-y-1.5">
        <Label htmlFor={`${title}-date`}>{t("shift.date")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={`${title}-date`}
              variant="outline"
              className={cn("w-full justify-start font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" aria-hidden />
              {format(value.date, "d MMM yyyy", { locale })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value.date}
              onSelect={(selected) => selected && update({ date: selected })}
              initialFocus
              locale={locale}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${title}-start`}>{t("shift.start")}</Label>
          <Input
            id={`${title}-start`}
            type="time"
            value={value.startTime}
            onChange={(e) => update({ startTime: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${title}-end`}>{t("shift.end")}</Label>
          <Input
            id={`${title}-end`}
            type="time"
            value={value.endTime}
            onChange={(e) => update({ endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${title}-break`}>{t("shift.break")}</Label>
          <Input
            id={`${title}-break`}
            type="number"
            min={0}
            inputMode="numeric"
            value={value.breakMinutes}
            onChange={(e) => update({ breakMinutes: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${title}-break-start`}>{t("shift.breakStart")}</Label>
          <Input
            id={`${title}-break-start`}
            type="time"
            value={value.breakStartTime}
            disabled={value.breakMinutes <= 0}
            onChange={(e) => update({ breakStartTime: e.target.value })}
          />
        </div>
      </div>
    </fieldset>
  )
}
