import { ActionTree } from 'vuex'

import { log } from '../../switcher'
import { getPeer } from '../../webrtc'
import { ServerConnection, Message } from '../../types'

import { MessagesStateInterface } from './state'

const actions: ActionTree<MessagesStateInterface, unknown> = {
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
    const server = rootGetters['connections/get'](id) as
      | ServerConnection
      | undefined
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
        receivedAt: rootGetters['call/startedAt'] as number,
        message: ['start'],
        type: 'call'
      }
      commit('add', { id: rootGetters['call/remote'] as string, ...message })
    }
  },
  hangup: {
    root: true,
    handler: ({ commit, rootGetters }) => {
      log('(dispatch) messages/hangup')
      const message: Message = {
        sent: false,
        receivedAt: rootGetters['call/endedAt'] as number,
        message: ['end'],
        type: 'call'
      }
      commit('add', { id: rootGetters['call/remote'] as string, ...message })
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
