import { Zeroconf } from 'app/src-capacitor/node_modules/@ionic-native/zeroconf'
import { Module } from '../types'
import { log, checkServer } from './utils'
import { startServer, stopServer } from './server'
import { publish, unpublish, watch, unwatch } from './mdns'

const capacitorModule: Module = {
  checkServer,
  defaultName: () => Zeroconf.getHostname(),
  startServer,
  stopServer,
  publish,
  unpublish,
  watch,
  unwatch,
  log
}

export default capacitorModule
