import { BrowserWindow, screen, Rectangle } from 'electron'
import { IpcChannels } from '../../shared/ipc-channels'
import { getState, updateSettings } from '../store/store'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { getSettings } from '../store/store'

let trayWindow: BrowserWindow | null = null
let pinned = false

export function getTrayWindow(): BrowserWindow | null {
  return trayWindow
}

export function setTrayPinned(value: boolean): void {
  pinned = value
}

export function isTrayPinned(): boolean {
  return pinned
}

function autoPinFromDrag(): void {
  if (pinned) return
  pinned = true
  updateSettings({ pinTray: true })
  // Broadcast so the renderer swaps the corner button to "minimize to tray".
  const state = getState()
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(IpcChannels.StoreStateChanged, state)
  }
}

export function createTrayWindow(): BrowserWindow {
  pinned = !!getSettings().pinTray
  trayWindow = new BrowserWindow({
    width: 320,
    height: 460,
    show: false,
    frame: false,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    fullscreenable: false,
    transparent: true,
    hasShadow: false,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  trayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  trayWindow.on('blur', () => {
    if (pinned) return
    if (!trayWindow?.webContents.isDevToolsOpened()) trayWindow?.hide()
  })
  // Fires when the user starts dragging the window. Auto-pin so dragging
  // converts the popover into a sticky window.
  trayWindow.on('will-move', autoPinFromDrag)
  trayWindow.on('closed', () => {
    trayWindow = null
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    trayWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/tray`)
  } else {
    trayWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/tray' })
  }

  return trayWindow
}

export function toggleTrayWindow(trayBounds: Rectangle): void {
  if (!trayWindow) createTrayWindow()
  if (!trayWindow) return

  if (trayWindow.isVisible()) {
    trayWindow.hide()
    return
  }

  if (pinned) {
    // Respect wherever the user has dragged it — just bring it back.
    trayWindow.show()
    trayWindow.focus()
    return
  }

  const winBounds = trayWindow.getBounds()
  const display = screen.getDisplayMatching(trayBounds)
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2)
  const y = Math.round(trayBounds.y + trayBounds.height + 4)
  const clampedX = Math.min(
    Math.max(x, display.workArea.x),
    display.workArea.x + display.workArea.width - winBounds.width
  )
  trayWindow.setPosition(clampedX, y, false)
  trayWindow.show()
  trayWindow.focus()
}
