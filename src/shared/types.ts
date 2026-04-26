export interface Session {
  id: string
  date: string
  startTime: number
  endTime: number | null
  duration: number
}

export interface DailyEntry {
  date: string
  mainGoal: string
  brainDump: string
  sessions: string[]
}

export interface Settings {
  overarchingGoal: string
  dayRolloverHour: number
  hideDock: boolean
  autoLaunch: boolean
  accent: string
  gentleReminder: boolean
  onboarded: boolean
  devDayOffset: number
}

export interface PersistedState {
  sessions: Record<string, Session>
  entries: Record<string, DailyEntry>
  settings: Settings
}

export interface TimerState {
  status: 'idle' | 'running' | 'paused'
  currentSessionId: string | null
  startedAt: number | null
  accumulatedMs: number
}
