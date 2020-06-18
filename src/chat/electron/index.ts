import os from 'os'

import { Module } from '../types'

import { log } from './utils'
import { watch, unwatch, publish, unpublish } from './mdns'
import { startServer, stopServer } from './server'

const electronModule: Module = {
  defaultName: async () => Promise.resolve(os.hostname()),
  startServer,
  stopServer,
  publish,
  unpublish,
  watch,
  unwatch,
  log
}

export default electronModule
