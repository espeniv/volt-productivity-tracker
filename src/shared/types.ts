export type Language = 'en' | 'no'

export interface Session {
  id: string
  date: string
  startTime: number
  endTime: number | null
  duration: number
}

export interface DailyEntry {
  date: string
  goals: string[]
  brainDump: string
  sessions: string[]
  mood?: number
  energy?: number
  /** Rating user gave to this day during the next morning's check-in. */
  dayRating?: number
}

export interface Settings {
  overarchingGoal: string
  dayRolloverHour: number
  hideDock: boolean
  autoLaunch: boolean
  accent: string
  gentleReminder: boolean
  /** HH:MM (24h, local time) — when the gentle reminder fires if not yet checked in. */
  reminderTime: string
  onboarded: boolean
  devDayOffset: number
  language: Language
}

export interface PersistedState {
  sessions: Record<string, Session>
  entries: Record<string, DailyEntry>
  settings: Settings
  schemaVersion?: number
}

export const CURRENT_SCHEMA_VERSION = 2

export interface TimerState {
  status: 'idle' | 'running' | 'paused'
  currentSessionId: string | null
  startedAt: number | null
  accumulatedMs: number
}
