import { Zeroconf } from 'app/src-capacitor/node_modules/@ionic-native/zeroconf'
import { Module } from '../types'
import { log } from './utils'
import { startServer, stopServer } from './server'
import { publish, unpublish, watch, unwatch } from './mdns'
import { Plugins } from '@capacitor/core'
const { EnumeratePlugin } = Plugins

const enumerateDevices: () => Promise<MediaDeviceInfo[]> = async () => {
  const result = await EnumeratePlugin.enumerateDevices()
  return result.devices
}

const capacitorModule: Module = {
  defaultName: () => Zeroconf.getHostname(),
  startServer,
  stopServer,
  publish,
  unpublish,
  watch,
  unwatch,
  log,
  enumerateDevices
}

export default capacitorModule
