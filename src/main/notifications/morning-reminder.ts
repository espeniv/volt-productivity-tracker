import { Notification } from 'electron'
import { getSettings, getState } from '../store/store'
import { showFloatingWindow } from '../windows/floating-window'

const HOUR = 10
const MINUTE = 0

let timeout: NodeJS.Timeout | null = null

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
  const ms = msUntilNext(HOUR, MINUTE)
  timeout = setTimeout(() => {
    maybeFire()
    scheduleNext()
  }, ms)
}

export function initMorningReminder(): void {
  // If the app started after today's 10:00 and the user hasn't checked in,
  // surface the reminder once on launch as well.
  const now = new Date()
  if (now.getHours() > HOUR || (now.getHours() === HOUR && now.getMinutes() >= MINUTE)) {
    setTimeout(maybeFire, 2000)
  }
  scheduleNext()
}

/** Fire the notification immediately, ignoring all conditions. For Settings → "Test reminder now". */
export function testMorningReminder(): void {
  showReminder()
}
