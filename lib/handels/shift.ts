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

function buildWorkIntervals(
  start: Date,
  end: Date,
  breakMinutes: number,
  breakStartTime?: string,
): WorkInterval[] {
  if (breakMinutes <= 0) {
    return [{ start, end }]
  }

  let breakStart: Date
  if (breakStartTime) {
    breakStart = parseTimeOnDay(start, breakStartTime)
    if (breakStart < start) {
      breakStart.setDate(breakStart.getDate() + 1)
    }
  } else {
    const midMs = start.getTime() + (end.getTime() - start.getTime()) / 2
    breakStart = new Date(midMs - (breakMinutes * 60 * 1000) / 2)
  }

  const breakEnd = new Date(breakStart.getTime() + breakMinutes * 60 * 1000)

  const clampedBreakStart = new Date(Math.max(breakStart.getTime(), start.getTime()))
  const clampedBreakEnd = new Date(Math.min(breakEnd.getTime(), end.getTime()))

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
