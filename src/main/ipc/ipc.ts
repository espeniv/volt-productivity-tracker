import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { IpcChannels } from '../../shared/ipc-channels'
import { showMainWindow } from '../windows/main-window'
import { getTrayWindow, toggleTrayWindow } from '../windows/tray-window'
import { getTray } from '../tray/tray'
import { showFloatingWindow } from '../windows/floating-window'
import { getState, resetAll, updateSettings, upsertEntry } from '../store/store'
import { testMorningReminder } from '../notifications/morning-reminder'
import { pauseTimer, resumeTimer, startTimer, stopTimer } from '../timer/timer'
import type { DailyEntry, Settings } from '../../shared/types'

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannels.WindowShowMain, () => {
    // Don't force dock visibility here — `applySettingsSideEffects` is the single
    // source of truth based on the user's hideDock preference.
    showMainWindow()
  })

  ipcMain.handle(IpcChannels.WindowHideTray, () => {
    getTrayWindow()?.hide()
  })

  ipcMain.handle(IpcChannels.WindowShowTray, () => {
    const tray = getTray()
    const win = getTrayWindow()
    if (!win || !tray) return
    if (win.isVisible()) {
      win.focus()
      return
    }
    toggleTrayWindow(tray.getBounds())
  })

  ipcMain.handle(IpcChannels.WindowOpenOnboarding, () => {
    // Don't force dock visibility here — `applySettingsSideEffects` is the single
    // source of truth based on the user's hideDock preference.
    showFloatingWindow('onboarding')
  })

  ipcMain.handle(IpcChannels.WindowOpenMorning, () => {
    // Don't force dock visibility here — `applySettingsSideEffects` is the single
    // source of truth based on the user's hideDock preference.
    showFloatingWindow('morning')
  })

  ipcMain.handle(IpcChannels.WindowCloseSelf, (e) => {
    BrowserWindow.fromWebContents(e.sender)?.close()
  })

  ipcMain.handle(IpcChannels.StoreGetAll, () => getState())

  ipcMain.handle(IpcChannels.StoreUpdateEntry, (_e, entry: DailyEntry) => {
    upsertEntry(entry)
    broadcastStoreUpdate()
  })

  ipcMain.handle(IpcChannels.StoreUpdateSettings, (_e, patch: Partial<Settings>) => {
    const next = updateSettings(patch)
    applySettingsSideEffects(next)
    broadcastStoreUpdate()
    return next
  })

  ipcMain.handle(IpcChannels.ShellOpenExternal, (_e, url: string) => {
    if (typeof url !== 'string') return
    if (!/^(https?:|mailto:)/i.test(url)) return
    shell.openExternal(url)
  })

  ipcMain.handle(IpcChannels.TrayResize, (_e, height: number) => {
    const win = getTrayWindow()
    if (!win) return
    const [w] = win.getSize()
    const clamped = Math.max(120, Math.min(800, Math.round(height)))
    win.setSize(w, clamped, false)
  })

  ipcMain.handle(IpcChannels.DevTestReminder, () => {
    testMorningReminder()
  })

  ipcMain.handle(IpcChannels.DevResetData, () => {
    resetAll()
    app.relaunch()
    app.exit(0)
  })

  ipcMain.handle(IpcChannels.TimerStart, () => startTimer())
  ipcMain.handle(IpcChannels.TimerStop, () => stopTimer())
  ipcMain.handle(IpcChannels.TimerPause, () => pauseTimer())
  ipcMain.handle(IpcChannels.TimerResume, () => resumeTimer())
}

function broadcastStoreUpdate(): void {
  const state = getState()
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('store:state-changed', state)
  }
}

export function applySettingsSideEffects(settings: Settings): void {
  if (process.platform === 'darwin') {
    if (settings.hideDock) app.dock?.hide()
    else app.dock?.show()
  }
  if (app.isPackaged) {
    app.setLoginItemSettings({ openAtLogin: settings.autoLaunch })
  }
}
