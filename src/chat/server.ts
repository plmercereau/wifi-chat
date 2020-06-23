import Vue from 'vue'
import { Store } from 'vuex'

import {
  log,
  watch,
  unwatch,
  startServer,
  stopServer,
  publish,
  unpublish
} from './switcher'
import { Server } from './types'
import { disconnectAll } from './webrtc'
import { GlobalState } from './store'

export const EventBus = new Vue()

const useAddServer = (store: Store<{}>) => async (
  server?: Server
): Promise<void> => {
  if (server) {
    if (server.id === store.getters['local/id']) return
    console.log('adding server', server)
    if (store.getters['servers/get'](server.id))
      store.commit('servers/update', server)
    else store.commit('servers/add', server)
    try {
      await store.dispatch('servers/connect', server)
    } catch (error) {
      log('connection failed', error)
    }
  }
}

const useRemoveServer = (store: Store<{}>) => async (
  server?: Server
): Promise<void> => {
  log('Remove server', JSON.stringify(server))
  if (server) store.commit('servers/remove', server)
  return Promise.resolve(void 0)
}

export const useStop = (store: Store<{}>) => async () => {
  log('stopping')
  EventBus.$emit('stopping')
  store.commit('local/stop')

  await unwatch()
  await unpublish()
  await stopServer()
  disconnectAll()
  EventBus.$emit('stopped')
  store.commit('local/stopped')
}

export const useStart = (store: Store<GlobalState>) => {
  return async () => {
    if (store.getters['local/name']) {
      log('starting')
      EventBus.$emit('starting')
      store.commit('local/start')
      await startServer()
      await publish(store.getters['local/id'])
      watch(useAddServer(store), useRemoveServer(store))
      EventBus.$emit('started')
      store.commit('local/started')
    }
  }
}
