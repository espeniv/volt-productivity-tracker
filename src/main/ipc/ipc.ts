import { app, ipcMain } from 'electron'
import { IpcChannels } from '../../shared/ipc-channels'
import { showMainWindow } from '../windows/main-window'
import { getTrayWindow } from '../windows/tray-window'
import { getState, updateSettings, upsertEntry } from '../store/store'
import { getTimerState, pauseTimer, resumeTimer, startTimer, stopTimer } from '../timer/timer'
import type { DailyEntry, Settings } from '../../shared/types'

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannels.WindowShowMain, () => {
    if (process.platform === 'darwin') app.dock?.show()
    showMainWindow()
  })

  ipcMain.handle(IpcChannels.WindowHideTray, () => {
    getTrayWindow()?.hide()
  })

  ipcMain.handle(IpcChannels.StoreGetAll, () => getState())

  ipcMain.handle(IpcChannels.StoreUpdateEntry, (_e, entry: DailyEntry) => {
    upsertEntry(entry)
  })

  ipcMain.handle(IpcChannels.StoreUpdateSettings, (_e, patch: Partial<Settings>) => {
    const next = updateSettings(patch)
    applySettingsSideEffects(next)
    return next
  })

  ipcMain.handle(IpcChannels.TimerStart, () => startTimer())
  ipcMain.handle(IpcChannels.TimerStop, () => stopTimer())
  ipcMain.handle(IpcChannels.TimerPause, () => pauseTimer())
  ipcMain.handle(IpcChannels.TimerResume, () => resumeTimer())
  ipcMain.handle('timer:get-state', () => getTimerState())
}

export function applySettingsSideEffects(settings: Settings): void {
  if (process.platform === 'darwin') {
    if (settings.hideDock) app.dock?.hide()
    else app.dock?.show()
  }
  app.setLoginItemSettings({ openAtLogin: settings.autoLaunch })
}
