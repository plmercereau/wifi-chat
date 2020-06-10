import { Platform } from 'quasar'
import { Module } from './types'

let _module: Module
if (Platform.is.capacitor) _module = require('src/chat/capacitor').default
else if (Platform.is.electron) _module = require('src/chat/electron').default
else _module = require('src/chat/web').default

const {
  log,
  checkServer,
  defaultName,
  watch,
  unwatch,
  startServer,
  stopServer,
  publish,
  unpublish
} = _module

export {
  log,
  checkServer,
  defaultName,
  watch,
  unwatch,
  startServer,
  stopServer,
  publish,
  unpublish
}
