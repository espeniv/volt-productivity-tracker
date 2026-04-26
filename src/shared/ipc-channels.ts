export const IpcChannels = {
  TimerStart: 'timer:start',
  TimerStop: 'timer:stop',
  TimerPause: 'timer:pause',
  TimerResume: 'timer:resume',
  TimerStateChanged: 'timer:state-changed',
  StoreGetAll: 'store:get-all',
  StoreUpdateEntry: 'store:update-entry',
  StoreUpdateSettings: 'store:update-settings',
  WindowShowMain: 'window:show-main',
  WindowHideTray: 'window:hide-tray',
  WindowShowTray: 'window:show-tray',
  WindowOpenOnboarding: 'window:open-onboarding',
  WindowOpenMorning: 'window:open-morning',
  WindowCloseSelf: 'window:close-self',
  DevResetData: 'dev:reset-data',
  TrayResize: 'tray:resize'
} as const

export type IpcChannel = (typeof IpcChannels)[keyof typeof IpcChannels]
