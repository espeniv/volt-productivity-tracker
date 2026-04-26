import { Tray, Menu, nativeImage } from 'electron'
import { toggleTrayWindow } from '../windows/tray-window'
import { showMainWindow } from '../windows/main-window'
import iconPath from '../../../resources/icon.png?asset'

let tray: Tray | null = null

export function createTray(): Tray {
  const image = nativeImage.createFromPath(iconPath).resize({ width: 18, height: 18 })
  image.setTemplateImage(true)

  tray = new Tray(image)
  tray.setToolTip('Daily')

  tray.on('click', (_event, bounds) => toggleTrayWindow(bounds))
  tray.on('right-click', () => {
    const menu = Menu.buildFromTemplate([
      { label: 'Open Daily', click: () => showMainWindow() },
      { type: 'separator' },
      { role: 'quit' }
    ])
    tray?.popUpContextMenu(menu)
  })

  return tray
}

export function getTray(): Tray | null {
  return tray
}
