"use client"

import { format } from "date-fns"
import { sv, enUS } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { useLanguage } from "@/lib/language-context"
import { formatHoursDuration } from "@/lib/format"
import type { ShiftInput } from "@/lib/handels"

interface ShiftInputCardProps {
  id: string
  variant: "give" | "take"
  value: ShiftInput
  onChange: (value: ShiftInput) => void
  hours?: number
}

function DatePickerButton({
  id,
  value,
  onSelect,
  locale,
}: {
  id: string
  value: Date
  onSelect: (date: Date) => void
  locale: typeof sv
}) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()

  const button = (
    <Button
      id={id}
      variant="outline"
      className="w-full justify-start font-normal min-h-11 bg-background"
    >
      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
      {format(value, "EEE d MMM", { locale })}
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{button}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("shift.date")}</DrawerTitle>
          </DrawerHeader>
          <div className="flex justify-center pb-6">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(selected) => selected && onSelect(selected)}
              locale={locale}
            />
          </div>
          <div className="px-4 pb-6">
            <DrawerClose asChild>
              <Button className="w-full min-h-11">{t("shift.done")}</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(selected) => selected && onSelect(selected)}
          initialFocus
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  )
}

function HoursBadge({ hours, variant }: { hours: number; variant: "give" | "take" }) {
  const { language } = useLanguage()
  const label = formatHoursDuration(hours, language)

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        variant === "give"
          ? "bg-orange-50 text-orange-600"
          : "bg-primary/10 text-primary",
      )}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {label}
    </div>
  )
}

export function ShiftInputCard({ id, variant, value, onChange, hours }: ShiftInputCardProps) {
  const { language, t } = useLanguage()
  const locale = language === "sv" ? sv : enUS
  const update = (patch: Partial<ShiftInput>) => onChange({ ...value, ...patch })

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-sm">
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-date`}>{t("shift.date")}</Label>
        <DatePickerButton
          id={`${id}-date`}
          value={value.date}
          onSelect={(date) => update({ date })}
          locale={locale}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-start`}>{t("shift.start")}</Label>
          <Input
            id={`${id}-start`}
            type="time"
            className="min-h-11 bg-background"
            value={value.startTime}
            onChange={(e) => update({ startTime: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-end`}>{t("shift.end")}</Label>
          <Input
            id={`${id}-end`}
            type="time"
            className="min-h-11 bg-background"
            value={value.endTime}
            onChange={(e) => update({ endTime: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-break`}>{t("shift.break")}</Label>
          <Input
            id={`${id}-break`}
            type="number"
            min={0}
            inputMode="numeric"
            className="min-h-11 bg-background"
            value={value.breakMinutes}
            onChange={(e) => update({ breakMinutes: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${id}-break-start`}>{t("shift.breakStart")}</Label>
          <Input
            id={`${id}-break-start`}
            type="time"
            className="min-h-11 bg-background"
            value={value.breakStartTime}
            disabled={value.breakMinutes <= 0}
            onChange={(e) => update({ breakStartTime: e.target.value })}
          />
        </div>
      </div>

      {hours !== undefined && hours > 0 && <HoursBadge hours={hours} variant={variant} />}
    </div>
  )
}
