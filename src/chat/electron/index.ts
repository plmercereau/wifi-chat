import os from 'os'

import { Module } from '../types'

import { checkServer, log } from './utils'
import { watch, unwatch, publish, unpublish } from './mdns'
import { startServer, stopServer } from './server'

const electronModule: Module = {
  checkServer,
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
