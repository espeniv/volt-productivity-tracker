import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let mainWindow: BrowserWindow | null = null

export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

export function showMainWindow(): BrowserWindow {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
    mainWindow.focus()
    return mainWindow
  }

  mainWindow = new BrowserWindow({
    width: 780,
    height: 580,
    minWidth: 720,
    minHeight: 520,
    show: false,
    titleBarStyle: 'hiddenInset',
    transparent: true,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow?.show())
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/#/main`)
    mainWindow.webContents.once('did-frame-finish-load', () => mainWindow?.webContents.openDevTools({ mode: 'detach' }))
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/main' })
  }

  return mainWindow
}
