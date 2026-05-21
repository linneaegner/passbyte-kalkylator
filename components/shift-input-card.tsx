"use client"

import type { ReactNode } from "react"
import { format } from "date-fns"
import { sv, enUS } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import { useLanguage } from "@/lib/language-context"
import { formatHoursDuration } from "@/lib/format"
import type { ShiftInput } from "@/lib/handels"

interface ShiftInputCardProps {
  id: string
  value: ShiftInput
  onChange: (value: ShiftInput) => void
  hours?: number
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

function parseTime(value: string): { hour: number; minute: number } {
  const [hourPart, minutePart] = value.split(":")
  const hour = Number(hourPart)
  const minute = Number(minutePart)
  return {
    hour: Number.isFinite(hour) ? hour : 0,
    minute: Number.isFinite(minute) ? minute : 0,
  }
}

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
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
      className="w-full max-w-full justify-start font-normal min-h-11 bg-background"
    >
      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
      <span className="truncate">{format(value, "EEE d MMM", { locale })}</span>
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

function TimePickerField({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const { hour, minute } = parseTime(value)

  const setHour = (nextHour: number) => onChange(formatTime(nextHour, minute))
  const setMinute = (nextMinute: number) => onChange(formatTime(hour, nextMinute))

  if (isMobile) {
    return (
      <div className="min-w-0 space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              id={id}
              type="button"
              variant="outline"
              disabled={disabled}
              className="w-full max-w-full min-h-11 justify-start font-normal bg-background"
            >
              <Clock className="mr-2 h-4 w-4 shrink-0" aria-hidden />
              <span className="tabular-nums">{value}</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{label}</DrawerTitle>
            </DrawerHeader>
            <div className="grid grid-cols-2 gap-3 px-4 pb-4">
              <div className="space-y-1.5">
                <Label htmlFor={`${id}-hour`} className="text-xs text-muted-foreground">
                  {t("shift.hour")}
                </Label>
                <Select
                  value={String(hour)}
                  onValueChange={(v) => setHour(Number(v))}
                  disabled={disabled}
                >
                  <SelectTrigger id={`${id}-hour`} className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((h) => (
                      <SelectItem key={h} value={String(h)}>
                        {String(h).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${id}-minute`} className="text-xs text-muted-foreground">
                  {t("shift.minute")}
                </Label>
                <Select
                  value={String(minute)}
                  onValueChange={(v) => setMinute(Number(v))}
                  disabled={disabled}
                >
                  <SelectTrigger id={`${id}-minute`} className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {String(m).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="px-4 pb-6">
              <DrawerClose asChild>
                <Button className="w-full min-h-11">{t("shift.done")}</Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="time"
        className="min-h-11 min-w-0 bg-background"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function HoursBadge({ hours }: { hours: number }) {
  const { language } = useLanguage()
  const label = formatHoursDuration(hours, language)

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {label}
    </div>
  )
}

/** Side-by-side fields only on large screens; iPhone landscape stays single column. */
function FieldPair({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-3">{children}</div>
}

export function ShiftInputCard({ id, value, onChange, hours }: ShiftInputCardProps) {
  const { language, t } = useLanguage()
  const locale = language === "sv" ? sv : enUS
  const update = (patch: Partial<ShiftInput>) => onChange({ ...value, ...patch })

  return (
    <div className="card-surface w-full max-w-full min-w-0 overflow-hidden p-4 space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`${id}-date`}>{t("shift.date")}</Label>
        <DatePickerButton
          id={`${id}-date`}
          value={value.date}
          onSelect={(date) => update({ date })}
          locale={locale}
        />
      </div>

      <FieldPair>
        <TimePickerField
          id={`${id}-start`}
          label={t("shift.start")}
          value={value.startTime}
          onChange={(startTime) => update({ startTime })}
        />
        <TimePickerField
          id={`${id}-end`}
          label={t("shift.end")}
          value={value.endTime}
          onChange={(endTime) => update({ endTime })}
        />
      </FieldPair>

      <FieldPair>
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor={`${id}-break`}>{t("shift.break")}</Label>
          <Input
            id={`${id}-break`}
            type="number"
            min={0}
            inputMode="numeric"
            className="min-h-11 w-full min-w-0 bg-background"
            value={value.breakMinutes}
            onChange={(e) => update({ breakMinutes: Number(e.target.value) })}
          />
        </div>
        <TimePickerField
          id={`${id}-break-start`}
          label={t("shift.breakStart")}
          value={value.breakStartTime}
          disabled={value.breakMinutes <= 0}
          onChange={(breakStartTime) => update({ breakStartTime })}
        />
      </FieldPair>

      {hours !== undefined && hours > 0 && <HoursBadge hours={hours} />}
    </div>
  )
}
