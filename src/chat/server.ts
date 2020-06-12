import Vue from 'vue'
import { Store } from 'vuex'

import {
  log,
  watch,
  unwatch,
  startServer,
  stopServer,
  publish,
  unpublish,
  checkServer
} from './switcher'
import { Server } from './types'
import { disconnectAll, useHandlePeerRequest, connect } from './webrtc'

export const EventBus = new Vue()

const useAddServer = (store: Store<{}>) => async (
  server?: Server
): Promise<void> => {
  if (server) {
    if (
      process.env.NODE_ENV !== 'development' &&
      server.id === store.getters['local/id']
    )
      return
    const isOnline = await checkServer(server)
    if (store.getters['servers/get'](server.id))
      store.commit('servers/update', server)
    else store.commit('servers/add', server)
    // const serverConnection:ServerConnection = store.getters['servers/get'](server)
    if (isOnline) {
      log('Server is up')
      store.commit('servers/online', server.id)
      try {
        await connect(server, store)
      } catch {
        log('connection failed')
      }
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
  store.commit('reset') // TODO does it really work?
  EventBus.$emit('stopped')
  store.commit('local/stopped')
}

export const useStart = (store: Store<{}>) => {
  const handlePeerRequest = useHandlePeerRequest(store)

  return async () => {
    if (store.getters['local/name']) {
      log('starting')
      EventBus.$emit('starting')
      store.commit('local/start')
      await startServer(handlePeerRequest)
      await publish(store.getters['local/id'])
      watch(useAddServer(store), useRemoveServer(store))
      EventBus.$emit('started')
      store.commit('local/started')
    }
  }
}
