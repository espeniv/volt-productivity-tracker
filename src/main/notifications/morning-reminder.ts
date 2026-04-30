import { Notification } from 'electron'
import { getSettings, getState } from '../store/store'
import { showFloatingWindow } from '../windows/floating-window'

let timeout: NodeJS.Timeout | null = null
let initialFireTimeout: NodeJS.Timeout | null = null

function parseReminderTime(s: string): { hour: number; minute: number } {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim())
  if (!m) return { hour: 10, minute: 0 }
  const hour = Math.max(0, Math.min(23, parseInt(m[1], 10)))
  const minute = Math.max(0, Math.min(59, parseInt(m[2], 10)))
  return { hour, minute }
}

function dateKeyForToday(offsetDays: number, rolloverHour: number): string {
  const ms = Date.now() + offsetDays * 86400_000 - rolloverHour * 3600_000
  return new Date(ms).toISOString().slice(0, 10)
}

function morningDoneToday(): boolean {
  const settings = getSettings()
  const today = dateKeyForToday(settings.devDayOffset, settings.dayRolloverHour)
  const entry = getState().entries[today]
  return (entry?.goals?.length ?? 0) > 0
}

function showReminder(): void {
  if (!Notification.isSupported()) return
  const n = new Notification({
    title: 'Volt',
    body: "You haven't started your day yet. Take two minutes to check in.",
    silent: false
  })
  n.on('click', () => {
    showFloatingWindow('morning')
  })
  n.show()
}

function maybeFire(): void {
  if (!getSettings().gentleReminder) return
  if (morningDoneToday()) return
  showReminder()
}

function msUntilNext(hour: number, minute: number): number {
  const now = new Date()
  const next = new Date()
  next.setHours(hour, minute, 0, 0)
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1)
  return next.getTime() - now.getTime()
}

function scheduleNext(): void {
  if (timeout) clearTimeout(timeout)
  const { hour, minute } = parseReminderTime(getSettings().reminderTime)
  const ms = msUntilNext(hour, minute)
  timeout = setTimeout(() => {
    maybeFire()
    scheduleNext()
  }, ms)
}

export function initMorningReminder(): void {
  const { hour, minute } = parseReminderTime(getSettings().reminderTime)
  const now = new Date()
  // If the app started after today's reminder time and the user hasn't checked in,
  // surface the reminder once on launch as well.
  if (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute)) {
    initialFireTimeout = setTimeout(maybeFire, 2000)
  }
  scheduleNext()
}

/** Re-arm the timeout when the user changes the reminder time. */
export function rescheduleMorningReminder(): void {
  scheduleNext()
}

export function stopMorningReminder(): void {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  if (initialFireTimeout) {
    clearTimeout(initialFireTimeout)
    initialFireTimeout = null
  }
}

/** Fire the notification immediately, ignoring all conditions. For Settings → "Test reminder now". */
export function testMorningReminder(): void {
  showReminder()
}
