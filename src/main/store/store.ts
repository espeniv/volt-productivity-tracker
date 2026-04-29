import Store from 'electron-store'
import type { DailyEntry, PersistedState, Session, Settings } from '../../shared/types'
import { CURRENT_SCHEMA_VERSION } from '../../shared/types'

export const defaultSettings: Settings = {
  overarchingGoal: '',
  dayRolloverHour: 0,
  hideDock: true,
  autoLaunch: false,
  accent: '#5B9DD9',
  gentleReminder: false,
  reminderTime: '10:00',
  pinTray: false,
  onboarded: false,
  devDayOffset: 0,
  language: 'en'
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
        goals: { type: 'array', items: { type: 'string' } },
        // Legacy field kept in schema so pre-migration entries don't fail validation on load.
        mainGoal: { type: 'string' },
        brainDump: { type: 'string' },
        sessions: { type: 'array', items: { type: 'string' } },
        mood: { type: 'number' },
        energy: { type: 'number' },
        dayRating: { type: 'number' }
      },
      required: ['date']
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
      gentleReminder: { type: 'boolean' },
      reminderTime: { type: 'string' },
      pinTray: { type: 'boolean' },
      onboarded: { type: 'boolean' },
      devDayOffset: { type: 'number' },
      language: { type: 'string', enum: ['en', 'no'] }
    },
    default: defaultSettings
  },
  schemaVersion: { type: 'number', default: 0 }
} as const

let store: Store<PersistedState> | null = null

type MigrationStore = Store<PersistedState>

const migrations: Array<(s: MigrationStore) => void> = [
  // v0 → v1: { mainGoal: string } → { goals: string[] }
  (s) => {
    const rawEntries = s.get('entries') as unknown as Record<string, Record<string, unknown>>
    const migrated: Record<string, DailyEntry> = {}
    for (const [k, e] of Object.entries(rawEntries)) {
      if (Array.isArray(e.goals)) {
        migrated[k] = e as unknown as DailyEntry
      } else {
        const main = typeof e.mainGoal === 'string' ? e.mainGoal : ''
        migrated[k] = {
          date: typeof e.date === 'string' ? e.date : k,
          goals: main ? [main] : [],
          brainDump: typeof e.brainDump === 'string' ? e.brainDump : '',
          sessions: Array.isArray(e.sessions) ? (e.sessions as string[]) : [],
          mood: typeof e.mood === 'number' ? e.mood : undefined,
          energy: typeof e.energy === 'number' ? e.energy : undefined,
          dayRating: typeof e.dayRating === 'number' ? e.dayRating : undefined
        }
      }
    }
    s.set('entries', migrated)
  },
  // v1 → v2: add reminderTime to settings
  (s) => {
    const cur = s.get('settings')
    if (!cur.reminderTime) s.set('settings', { ...cur, reminderTime: '10:00' })
  },
  // v2 → v3: add pinTray to settings
  (s) => {
    const cur = s.get('settings')
    if (typeof cur.pinTray !== 'boolean') s.set('settings', { ...cur, pinTray: false })
  }
]

export function initStore(): void {
  store = new Store<PersistedState>({
    name: 'daily-data',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: schema as any,
    defaults: { sessions: {}, entries: {}, settings: defaultSettings, schemaVersion: 0 }
  })

  // Backfill defaults onto previously-persisted settings (covers brand-new fields).
  const current = store.get('settings')
  store.set('settings', { ...defaultSettings, ...current })

  // Run any migrations the user hasn't seen yet, in order.
  const from = (store.get('schemaVersion') as number | undefined) ?? 0
  for (let v = from; v < migrations.length; v++) migrations[v](store)
  store.set('schemaVersion', CURRENT_SCHEMA_VERSION)
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

export function deleteSession(id: string): void {
  const s = requireStore()
  const sessions = { ...s.get('sessions') }
  delete sessions[id]
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

export function resetAll(): void {
  const s = requireStore()
  s.clear()
  s.set('sessions', {})
  s.set('entries', {})
  s.set('settings', defaultSettings)
}
