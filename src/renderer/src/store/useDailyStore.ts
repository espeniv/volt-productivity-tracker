import { create } from 'zustand'
import type { DailyEntry, Session, Settings, TimerState } from '../../../shared/types'

interface DailyStore {
  sessions: Record<string, Session>
  entries: Record<string, DailyEntry>
  settings: Settings
  timer: TimerState
  hydrated: boolean

  setHydrated: (state: {
    sessions: Record<string, Session>
    entries: Record<string, DailyEntry>
    settings: Settings
  }) => void
  setTimer: (timer: TimerState) => void
  upsertSession: (session: Session) => void
  upsertEntry: (entry: DailyEntry) => void
  updateSettings: (patch: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  overarchingGoal: '',
  dayRolloverHour: 0,
  hideDock: true,
  autoLaunch: false,
  accent: '#5B9DD9',
  theme: 'system',
  gentleReminder: false,
  onboarded: false
}

export const useDailyStore = create<DailyStore>((set) => ({
  sessions: {},
  entries: {},
  settings: defaultSettings,
  timer: { status: 'idle', currentSessionId: null, startedAt: null, accumulatedMs: 0 },
  hydrated: false,

  setHydrated: ({ sessions, entries, settings }) =>
    set({ sessions, entries, settings, hydrated: true }),
  setTimer: (timer) => set({ timer }),
  upsertSession: (session) =>
    set((s) => ({ sessions: { ...s.sessions, [session.id]: session } })),
  upsertEntry: (entry) => set((s) => ({ entries: { ...s.entries, [entry.date]: entry } })),
  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } }))
}))
