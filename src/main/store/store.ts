import Store from 'electron-store'
import type { DailyEntry, PersistedState, Session, Settings } from '../../shared/types'

const defaultSettings: Settings = {
  overarchingGoal: '',
  dayRolloverHour: 0,
  hideDock: true,
  autoLaunch: false,
  accent: '#5B9DD9',
  theme: 'system',
  userName: '',
  gentleReminder: false,
  onboarded: false
}

const schema = {
  sessions: {
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        date: { type: 'string' },
        startTime: { type: 'number' },
        endTime: { type: ['number', 'null'] },
        duration: { type: 'number' }
      },
      required: ['id', 'date', 'startTime', 'duration']
    },
    default: {}
  },
  entries: {
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        date: { type: 'string' },
        mainGoal: { type: 'string' },
        brainDump: { type: 'string' },
        sessions: { type: 'array', items: { type: 'string' } }
      },
      required: ['date', 'mainGoal', 'brainDump', 'sessions']
    },
    default: {}
  },
  settings: {
    type: 'object',
    properties: {
      overarchingGoal: { type: 'string' },
      dayRolloverHour: { type: 'number', minimum: 0, maximum: 23 },
      hideDock: { type: 'boolean' },
      autoLaunch: { type: 'boolean' },
      accent: { type: 'string' },
      theme: { type: 'string', enum: ['light', 'dark', 'system'] },
      userName: { type: 'string' },
      gentleReminder: { type: 'boolean' },
      onboarded: { type: 'boolean' }
    },
    default: defaultSettings
  }
} as const

let store: Store<PersistedState> | null = null

export function initStore(): void {
  store = new Store<PersistedState>({
    name: 'daily-data',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: schema as any,
    defaults: { sessions: {}, entries: {}, settings: defaultSettings }
  })
  // Backfill missing fields onto previously-persisted settings
  const current = store.get('settings')
  store.set('settings', { ...defaultSettings, ...current })
}

function requireStore(): Store<PersistedState> {
  if (!store) throw new Error('Store not initialized')
  return store
}

export function getState(): PersistedState {
  const s = requireStore()
  return {
    sessions: s.get('sessions'),
    entries: s.get('entries'),
    settings: s.get('settings')
  }
}

export function upsertSession(session: Session): void {
  const s = requireStore()
  const sessions = { ...s.get('sessions'), [session.id]: session }
  s.set('sessions', sessions)
}

export function upsertEntry(entry: DailyEntry): void {
  const s = requireStore()
  const entries = { ...s.get('entries'), [entry.date]: entry }
  s.set('entries', entries)
}

export function updateSettings(patch: Partial<Settings>): Settings {
  const s = requireStore()
  const next = { ...s.get('settings'), ...patch }
  s.set('settings', next)
  return next
}

export function getSettings(): Settings {
  return requireStore().get('settings')
}
