/* eslint-disable @typescript-eslint/no-var-requires */
import { Platform } from 'quasar'
console.log('(global) select platform', Platform.is)
import { Module } from './types'

let _module: Module
if (Platform.is.capacitor)
  _module = require('src/chat/capacitor').default as Module
else if (Platform.is.electron)
  _module = require('src/chat/electron').default as Module
else _module = require('src/chat/web').default as Module

const {
  log,
  defaultName,
  watch,
  unwatch,
  startServer,
  stopServer,
  publish,
  unpublish,
  enumerateDevices
} = _module

export {
  log,
  defaultName,
  watch,
  unwatch,
  startServer,
  stopServer,
  publish,
  unpublish,
  enumerateDevices
}
