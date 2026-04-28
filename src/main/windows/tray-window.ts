import { BrowserWindow, screen, Rectangle } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let trayWindow: BrowserWindow | null = null

export function getTrayWindow(): BrowserWindow | null {
  return trayWindow
}

export function createTrayWindow(): BrowserWindow {
  trayWindow = new BrowserWindow({
    width: 320,
    height: 460,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    fullscreenable: false,
    transparent: true,
    hasShadow: false,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    }
  })

  trayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  trayWindow.on('blur', () => {
    if (!trayWindow?.webContents.isDevToolsOpened()) trayWindow?.hide()
  })
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
