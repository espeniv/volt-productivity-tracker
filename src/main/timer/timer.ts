import { randomUUID } from 'crypto'
import { BrowserWindow } from 'electron'
import { IpcChannels } from '../../shared/ipc-channels'
import type { Session, TimerState } from '../../shared/types'
import { upsertSession, deleteSession, getState, getSettings } from '../store/store'

let state: TimerState = {
  status: 'idle',
  currentSessionId: null,
  startedAt: null,
  accumulatedMs: 0
}

let persistInterval: NodeJS.Timeout | null = null

export function getTimerState(): TimerState {
  return { ...state }
}

export function initTimer(): void {
  recoverInterruptedSession()
}

export function startTimer(): TimerState {
  if (state.status === 'running') return getTimerState()

  if (state.status === 'paused' && state.currentSessionId) {
    state = { ...state, status: 'running', startedAt: Date.now() }
    startPersistLoop()
    broadcast()
    return getTimerState()
  }

  const id = randomUUID()
  const now = Date.now()
  const session: Session = {
    id,
    date: dateKey(now + (getSettings().devDayOffset || 0) * 86400_000),
    startTime: now,
    endTime: null,
    duration: 0
  }
  upsertSession(session)

  state = { status: 'running', currentSessionId: id, startedAt: now, accumulatedMs: 0 }
  startPersistLoop()
  broadcast()
  return getTimerState()
}

export function pauseTimer(): TimerState {
  if (state.status !== 'running' || !state.startedAt) return getTimerState()
  const elapsed = Date.now() - state.startedAt
  state = {
    ...state,
    status: 'paused',
    accumulatedMs: state.accumulatedMs + elapsed,
    startedAt: null
  }
  persistCurrent()
  stopPersistLoop()
  broadcast()
  return getTimerState()
}

export function resumeTimer(): TimerState {
  if (state.status !== 'paused' || !state.currentSessionId) return getTimerState()
  state = { ...state, status: 'running', startedAt: Date.now() }
  startPersistLoop()
  broadcast()
  return getTimerState()
}

export function stopTimer(): TimerState {
  if (state.status === 'idle' || !state.currentSessionId) return getTimerState()

  const totalMs = currentTotalMs()
  const durationSeconds = Math.round(totalMs / 1000)
  const sessions = getState().sessions
  const existing = sessions[state.currentSessionId]
  if (existing) {
    if (durationSeconds < 60) {
      // Treat as a misclick — discard rather than logging.
      deleteSession(existing.id)
    } else {
      upsertSession({
        ...existing,
        endTime: Date.now(),
        duration: durationSeconds
      })
    }
  }

  state = { status: 'idle', currentSessionId: null, startedAt: null, accumulatedMs: 0 }
  stopPersistLoop()
  broadcast()
  return getTimerState()
}

function currentTotalMs(): number {
  if (state.status === 'running' && state.startedAt) {
    return state.accumulatedMs + (Date.now() - state.startedAt)
  }
  return state.accumulatedMs
}

function persistCurrent(): void {
  if (!state.currentSessionId) return
  const sessions = getState().sessions
  const existing = sessions[state.currentSessionId]
  if (!existing) return
  upsertSession({
    ...existing,
    duration: Math.round(currentTotalMs() / 1000)
  })
}

function startPersistLoop(): void {
  stopPersistLoop()
  persistInterval = setInterval(persistCurrent, 60_000)
}

function stopPersistLoop(): void {
  if (persistInterval) {
    clearInterval(persistInterval)
    persistInterval = null
  }
}

function broadcast(): void {
  const snapshot = getTimerState()
  const persisted = getState()
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(IpcChannels.TimerStateChanged, snapshot)
    win.webContents.send('store:state-changed', persisted)
  }
}

function dateKey(ms: number): string {
  const d = new Date(ms)
  const rollover = getSettings().dayRolloverHour
  const adjusted = new Date(d.getTime() - rollover * 3600_000)
  return adjusted.toISOString().slice(0, 10)
}

function recoverInterruptedSession(): void {
  const sessions = getState().sessions
  const open = Object.values(sessions).find((s) => s.endTime === null)
  if (!open) return
  if (open.duration < 60) {
    deleteSession(open.id)
    return
  }
  upsertSession({
    ...open,
    endTime: open.startTime + open.duration * 1000
  })
}
