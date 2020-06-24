import { ActionTree } from 'vuex'

import { Data, Status, Server } from '../../types'
import { log } from '../../switcher'
import { getPeer, ExtendedPeer, disconnectAll } from '../../webrtc'

import { ServersStateInterface } from './state'

const actions: ActionTree<ServersStateInterface, unknown> = {
  on: (
    { commit, dispatch },
    { id, strData }: { id: string; strData: string }
  ) => {
    log('(dispatch) connections/on')
    const data = JSON.parse(strData) as Data
    const dataHandlers = {
      name: () => commit('update', { id, name: data.value }),
      avatar: () => commit('update', { id, avatar: data.value }),
      message: async () =>
        await dispatch(
          'messages/receive',
          { id, message: data.value },
          { root: true }
        ),
      status: async () => await dispatch('status', { id, status: data.value }),
      call: async () =>
        await dispatch(`${data.value as string}`, { id }, { root: true })
    }
    void dataHandlers[data.type]()
  },
  status: ({ commit }, { id, status }: { id: string; status: Status }) => {
    log('(dispatch) connections/status')
    commit('update', { id, status: status })
  },
  disconnect: async ({ dispatch, rootGetters }, id: string) => {
    log('(dispatch) connections/disconnect')
    if (rootGetters['call/remote'] === id)
      await dispatch('hangup', undefined, { root: true })
    await dispatch('status', { id, status: 'disconnected' })
  },
  remove: (
    { commit, rootGetters },
    { id, checkHistory }: { id: string; checkHistory: boolean }
  ) => {
    log('(dispatch) connections/remove')
    // TODO rootGetters['messages/get'](id).length === 0 => dedicated getter
    if (!checkHistory || rootGetters['messages/get'](id).length === 0)
      commit('remove', id)
  },
  connect: async (
    { rootGetters, dispatch },
    { id, secure, hostname, port }: Server
  ) => {
    // TODO set status to disconnected when the ws connection fails, or when it disconnects
    log('(dispatch) connections/connect')
    await new Promise<void>((resolve, reject) => {
      const localId = rootGetters['local/id'] as string
      if (getPeer(id)) {
        log('(ws client): peer already exists.', getPeer(id))
        reject()
      }
      if (localId === id) {
        log('(ws client): cannot connect to loopback (self)')
        reject()
      }
      const ws = new WebSocket(`${secure ? 'wss' : 'ws'}://${hostname}:${port}`)
      let peer: ExtendedPeer | undefined
      ws.addEventListener('open', () => {
        log(
          '(ws client) connected. Creating peer and sending local id through the websocket'
        )
        peer = new ExtendedPeer({
          id,
          signal: (message: string) => ws.send(message)
        })
        peer.on('connect', () => {
          log('(ws client) peer connected. resolve.')
          resolve()
        })
        peer.on('error', error => {
          reject(`(ws client) peer error. reject. Message: ${error.message}`)
        })
        ws.send(JSON.stringify({ id: localId }))
      })

      ws.addEventListener('error', error => {
        log('(ws client) error', error)
        reject()
      })
      ws.addEventListener('close', () => {
        log('(ws client) close')
        if (peer) peer.destroy()
        else void dispatch('disconnect', id)
      })
      ws.addEventListener('message', function incoming({ data }) {
        log('(ws client) message', data.length)
        try {
          peer?.signal(data)
        } catch (error) {
          // * Peer has been probably destroyed
          log('(ws client) peer signal error', error)
          ws.close()
          reject()
        }
      })
    })
  },
  reset: {
    root: true,
    handler: ({ commit }) => {
      log('(dispatch) connections/reset')
      disconnectAll()
      commit('reset')
    }
  }
}

export default actions
