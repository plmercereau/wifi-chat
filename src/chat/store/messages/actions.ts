import { ActionTree } from 'vuex'

import { log } from '../../switcher'
import { getPeer } from '../../webrtc'
import { ServerConnection, Message } from '../../types'

import { MessagesStateInterface } from './state'

const actions: ActionTree<MessagesStateInterface, {}> = {
  receive: ({ commit }, { id, message }: { id: string; message: string[] }) => {
    log('(dispatch) messages/receive', id, message)
    commit('add', {
      id,
      sent: false,
      receivedAt: Date.now(),
      message,
      type: 'message'
    })
  },
  send: (
    { commit, rootGetters },
    { id, message }: { id: string; message: string[] }
  ) => {
    log('(dispatch) messages/send', id)
    const server: ServerConnection | undefined = rootGetters['connections/get'](
      id
    )
    if (!server) {
      log('dispatch) messages/send: no server found')
      return
    }
    const peer = getPeer(server)
    peer?.sendMessage(message)
    commit('add', {
      id,
      sent: true,
      sentAt: Date.now(),
      message,
      type: 'message'
    })
  },
  pickup: {
    root: true,
    handler: ({ commit, rootGetters }) => {
      log('(dispatch) messages/pickup')
      const message: Message = {
        sent: false,
        receivedAt: rootGetters['call/startedAt'],
        message: ['start'],
        type: 'call'
      }
      commit('add', { id: rootGetters['call/remote'], ...message })
    }
  },
  hangup: {
    root: true,
    handler: ({ commit, rootGetters }) => {
      log('(dispatch) messages/hangup')
      const message: Message = {
        sent: false,
        receivedAt: rootGetters['call/endedAt'],
        message: ['end'],
        type: 'call'
      }
      commit('add', { id: rootGetters['call/remote'], ...message })
    }
  },
  reset: {
    root: true,
    handler: ({ commit }) => {
      log('(dispatch) messages/reset')
      commit('reset')
    }
  }
}

export default actions
