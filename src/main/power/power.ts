import { powerMonitor } from 'electron'
import { getTimerState, pauseTimer } from '../timer/timer'

export function initPowerMonitor(): void {
  // System going to sleep, screen locking, or shutting down — pause a running timer
  // so the duration doesn't accumulate idle time.
  const pauseIfRunning = (): void => {
    if (getTimerState().status === 'running') pauseTimer()
  }

  powerMonitor.on('suspend', pauseIfRunning)
  powerMonitor.on('lock-screen', pauseIfRunning)
  powerMonitor.on('shutdown', pauseIfRunning)
}
