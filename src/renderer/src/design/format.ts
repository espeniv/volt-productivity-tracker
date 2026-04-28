export function fmtClock(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function fmtDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

import type { Language } from '../../../shared/types'

function locale(lang?: Language): string {
  return lang === 'no' ? 'nb-NO' : 'en-US'
}

export function fmtTimeOfDay(date: Date, lang?: Language): string {
  return date.toLocaleTimeString(locale(lang), { hour: 'numeric', minute: '2-digit' })
}

export function todayLong(d: Date = new Date(), lang?: Language): string {
  return d.toLocaleDateString(locale(lang), { weekday: 'long', month: 'long', day: 'numeric' })
}

export function fmtMonthYear(d: Date, lang?: Language): string {
  return d.toLocaleDateString(locale(lang), { month: 'long', year: 'numeric' })
}

export function fmtFullDate(d: Date, lang?: Language): string {
  return d.toLocaleDateString(locale(lang), { month: 'long', day: 'numeric', year: 'numeric' })
}

/** Norwegian/most-of-Europe is Monday-first; en-US is Sunday-first. */
export function weekStartsOnMonday(lang?: Language): boolean {
  return lang === 'no'
}

export function weekdayShorts(lang?: Language): string[] {
  const base = new Date(2024, 0, 7) // a Sunday
  const fmt = new Intl.DateTimeFormat(locale(lang), { weekday: 'narrow' })
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    days.push(fmt.format(d))
  }
  if (weekStartsOnMonday(lang)) {
    days.push(days.shift() as string)
  }
  return days
}

export function dateKey(ms: number, rolloverHour = 0): string {
  const adjusted = new Date(ms - rolloverHour * 3600_000)
  return adjusted.toISOString().slice(0, 10)
}

export function nowWithOffset(devDayOffset: number): number {
  return Date.now() + devDayOffset * 86400_000
}

export function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '')
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
