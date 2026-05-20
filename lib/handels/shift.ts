export interface ShiftBounds {
  start: Date
  end: Date
  grossHours: number
  paidHours: number
}

export function parseShiftBounds(
  date: Date,
  startTime: string,
  endTime: string,
  breakMinutes: number,
): ShiftBounds {
  const [startHour, startMinute] = startTime.split(":").map(Number)
  const [endHour, endMinute] = endTime.split(":").map(Number)

  const start = new Date(date)
  start.setHours(startHour, startMinute, 0, 0)

  const end = new Date(date)
  if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
    end.setDate(end.getDate() + 1)
  }
  end.setHours(endHour, endMinute, 0, 0)

  const grossHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  const paidHours = Math.max(0, grossHours - breakMinutes / 60)

  return { start, end, grossHours, paidHours }
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
