import { Module } from '../types'

const webModule: Module = {
  defaultName: async () => Promise.resolve('localhost'),
  startServer: () => {
    throw Error('not implemented')
  },
  stopServer: () => {
    throw Error('not implemented')
  },
  publish: () => {
    throw Error('not implemented')
  },
  unpublish: () => {
    throw Error('not implemented')
  },
  watch: () => {
    throw Error('not implemented')
  },
  unwatch: () => {
    throw Error('not implemented')
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: console.log
}

export default webModule
