/** Clone calendar day and set local time without mutating the input. */
export function atTime(base: Date, hours: number, minutes = 0, seconds = 0, ms = 0): Date {
  const d = new Date(base)
  d.setHours(hours, minutes, seconds, ms)
  return d
}

/** End of calendar day (23:59:59.999). */
export function endOfDay(base: Date): Date {
  return atTime(base, 23, 59, 59, 999)
}

/** Start of the next calendar day at the given clock time. */
export function nextDayAt(base: Date, hours: number, minutes = 0): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + 1)
  return atTime(d, hours, minutes)
}

export function calculateOverlapHours(start1: Date, end1: Date, start2: Date, end2: Date): number {
  const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()))
  const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()))
  if (overlapEnd <= overlapStart) return 0
  return (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60)
}
