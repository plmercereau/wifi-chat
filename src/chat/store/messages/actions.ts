import { ActionTree } from 'vuex'
import { log } from 'src/chat/switcher'
import { getPeer } from '../../webrtc'
import { ServerConnection, Message } from '../../types'
import { MessagesStateInterface } from './state'

const actions: ActionTree<MessagesStateInterface, {}> = {
  receive: ({ commit }, { id, message }: { id: string; message: string[] }) => {
    log('dispatch messages/receive', id, message)
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
    log('dispatch messages/send', id)
    const server: ServerConnection | undefined = rootGetters['servers/get'](id)
    if (!server) {
      log('messages/send: no server found')
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
  pickup: ({ commit, rootGetters }, id: string) => {
    const message: Message = {
      sent: false,
      receivedAt: rootGetters['call/startedAt'],
      message: ['start'],
      type: 'call'
    }
    commit('add', { id, ...message })
  },
  hangup: ({ commit, rootGetters }, id: string) => {
    const message: Message = {
      sent: false,
      receivedAt: rootGetters['call/endedAt'],
      message: ['end'],
      type: 'call'
    }
    commit('add', { id, ...message })
  }
}

export default actions
