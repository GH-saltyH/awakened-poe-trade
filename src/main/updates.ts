import { autoUpdater } from 'electron-updater'
import { logger } from './logger'
import { rebuildContextMenu } from './tray'

export const UpdateState = {
  canCheck: true,
  status: ''
}

autoUpdater.on('update-available', (info: { version: string }) => {
  UpdateState.canCheck = false
  if (autoUpdater.autoDownload) {
    UpdateState.status = `Downloading v${info.version} ...`
  } else {
    UpdateState.status = `Update v${info.version} available on Github`
  }
  rebuildContextMenu()
})

autoUpdater.on('update-not-available', () => {
  UpdateState.canCheck = true
  UpdateState.status = 'No updates available'
  rebuildContextMenu()
})

autoUpdater.on('error', () => {
  UpdateState.canCheck = true
  UpdateState.status = 'Something went wrong, check logs'
  rebuildContextMenu()
})

autoUpdater.on('update-downloaded', (info: { version: string }) => {
  UpdateState.canCheck = false
  UpdateState.status = `v${info.version} will be installed on exit`
  rebuildContextMenu()
})

// on('download-progress') https://github.com/electron-userland/electron-builder/issues/2521

export async function checkForUpdates () {
  autoUpdater.logger = logger
  autoUpdater.autoDownload = !process.env.PORTABLE_EXECUTABLE_DIR // https://www.electron.build/configuration/nsis.html#portable

  UpdateState.canCheck = false
  UpdateState.status = 'Checking for update...'
  rebuildContextMenu()

  try {
    await autoUpdater.checkForUpdates()
  } catch {
    // handled by event
  }
}
