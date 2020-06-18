import { Zeroconf } from 'app/src-capacitor/node_modules/@ionic-native/zeroconf'
import { Module } from '../types'
import { log } from './utils'
import { startServer, stopServer } from './server'
import { publish, unpublish, watch, unwatch } from './mdns'

const capacitorModule: Module = {
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
