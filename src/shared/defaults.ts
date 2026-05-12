import type { Settings, TimerState } from './types'

export const defaultSettings: Settings = {
  overarchingGoal: '',
  dayRolloverHour: 0,
  hideDock: true,
  autoLaunch: false,
  accent: '#F59E0B',
  gentleReminder: false,
  reminderTime: '10:00',
  pinTray: false,
  onboarded: false,
  devDayOffset: 0,
  language: 'en'
}

export const initialTimerState: TimerState = {
  status: 'idle',
  currentSessionId: null,
  startedAt: null,
  accumulatedMs: 0
}
