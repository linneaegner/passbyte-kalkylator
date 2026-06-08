export interface ShiftBounds {
  start: Date
  end: Date
  grossHours: number
  paidHours: number
  workIntervals: WorkInterval[]
}

export interface WorkInterval {
  start: Date
  end: Date
}

function parseTimeOnDay(day: Date, time: string): Date {
  const [hour, minute] = time.split(":").map(Number)
  const d = new Date(day)
  d.setHours(hour, minute, 0, 0)
  return d
}

export function parseShiftBounds(
  date: Date,
  startTime: string,
  endTime: string,
  breakMinutes: number,
  breakStartTime?: string,
): ShiftBounds {
  const start = parseTimeOnDay(date, startTime)
  const end = parseTimeOnDay(date, endTime)
  if (end <= start) {
    end.setDate(end.getDate() + 1)
  }

  const grossHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  const workIntervals = buildWorkIntervals(start, end, breakMinutes, breakStartTime)
  const paidHours = workIntervals.reduce(
    (sum, interval) => sum + (interval.end.getTime() - interval.start.getTime()) / (1000 * 60 * 60),
    0,
  )

  return { start, end, grossHours, paidHours, workIntervals }
}

function intervalsOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart
}

function centeredBreakStart(start: Date, end: Date, breakMinutes: number): Date {
  const midMs = start.getTime() + (end.getTime() - start.getTime()) / 2
  return new Date(midMs - (breakMinutes * 60 * 1000) / 2)
}

function resolveBreakWindow(
  start: Date,
  end: Date,
  breakMinutes: number,
  breakStartTime?: string,
): { breakStart: Date; breakEnd: Date } {
  if (!breakStartTime) {
    const breakStart = centeredBreakStart(start, end, breakMinutes)
    return { breakStart, breakEnd: new Date(breakStart.getTime() + breakMinutes * 60 * 1000) }
  }

  let breakStart = parseTimeOnDay(start, breakStartTime)
  let breakEnd = new Date(breakStart.getTime() + breakMinutes * 60 * 1000)

  if (!intervalsOverlap(breakStart, breakEnd, start, end) && breakStart < start) {
    const nextDayBreakStart = new Date(breakStart)
    nextDayBreakStart.setDate(nextDayBreakStart.getDate() + 1)
    const nextDayBreakEnd = new Date(nextDayBreakStart.getTime() + breakMinutes * 60 * 1000)
    if (intervalsOverlap(nextDayBreakStart, nextDayBreakEnd, start, end)) {
      breakStart = nextDayBreakStart
      breakEnd = nextDayBreakEnd
    }
  }

  if (!intervalsOverlap(breakStart, breakEnd, start, end)) {
    breakStart = centeredBreakStart(start, end, breakMinutes)
    breakEnd = new Date(breakStart.getTime() + breakMinutes * 60 * 1000)
  }

  return { breakStart, breakEnd }
}

function buildWorkIntervals(
  start: Date,
  end: Date,
  breakMinutes: number,
  breakStartTime?: string,
): WorkInterval[] {
  if (breakMinutes <= 0) {
    return [{ start, end }]
  }

  const { breakStart, breakEnd } = resolveBreakWindow(start, end, breakMinutes, breakStartTime)

  const clampedBreakStart = new Date(Math.max(breakStart.getTime(), start.getTime()))
  const clampedBreakEnd = new Date(Math.min(breakEnd.getTime(), end.getTime()))

  if (clampedBreakEnd <= clampedBreakStart) {
    return [{ start, end }]
  }

  const intervals: WorkInterval[] = []
  if (clampedBreakStart > start) {
    intervals.push({ start, end: clampedBreakStart })
  }
  if (clampedBreakEnd < end) {
    intervals.push({ start: clampedBreakEnd, end })
  }

  return intervals.length > 0 ? intervals : [{ start, end }]
}

/** Calendar days touched by a shift (local midnight boundaries). */
export function calendarDaysInShift(start: Date, end: Date): Date[] {
  const days: Date[] = []
  const cursor = new Date(start)
  cursor.setHours(0, 0, 0, 0)
  const last = new Date(end)
  last.setHours(0, 0, 0, 0)

  while (cursor.getTime() <= last.getTime()) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}
