import { create } from 'zustand'
import type { DailyEntry, Session, Settings, TimerState } from '../../../shared/types'
import { defaultSettings, initialTimerState } from '../../../shared/defaults'

function shallowEqual(a: object, b: object): boolean {
  if (a === b) return true
  const ar = a as Record<string, unknown>
  const br = b as Record<string, unknown>
  const ak = Object.keys(ar)
  const bk = Object.keys(br)
  if (ak.length !== bk.length) return false
  for (const k of ak) if (ar[k] !== br[k]) return false
  return true
}

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
  replaceState: (state: {
    sessions: Record<string, Session>
    entries: Record<string, DailyEntry>
    settings: Settings
  }) => void
  setTimer: (timer: TimerState) => void
  upsertSession: (session: Session) => void
  upsertEntry: (entry: DailyEntry) => void
  updateSettings: (patch: Partial<Settings>) => void
}

export const useDailyStore = create<DailyStore>((set) => ({
  sessions: {},
  entries: {},
  settings: defaultSettings,
  timer: initialTimerState,
  hydrated: false,

  setHydrated: ({ sessions, entries, settings }) =>
    set({ sessions, entries, settings, hydrated: true }),
  replaceState: ({ sessions, entries, settings }) =>
    set((s) => {
      const patch: Partial<DailyStore> = {}
      if (!shallowEqual(s.sessions, sessions)) patch.sessions = sessions
      if (!shallowEqual(s.entries, entries)) patch.entries = entries
      if (!shallowEqual(s.settings, settings)) patch.settings = settings
      return patch
    }),
  setTimer: (timer) => set({ timer }),
  upsertSession: (session) =>
    set((s) => ({ sessions: { ...s.sessions, [session.id]: session } })),
  upsertEntry: (entry) => set((s) => ({ entries: { ...s.entries, [entry.date]: entry } })),
  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } }))
}))
