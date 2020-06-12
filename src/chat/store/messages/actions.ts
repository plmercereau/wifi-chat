import { ActionTree } from 'vuex'
import { MessagesStateInterface } from './state'
import { getPeer } from '../../webrtc'
import { ServerConnection } from '../../types'

const actions: ActionTree<MessagesStateInterface, {}> = {
  receive: ({ commit }, { id, message }: { id: string; message: string[] }) => {
    console.log('messages/receive')
    commit('add', { id, sent: false, receivedAt: Date.now(), message })
  },
  send: (
    { commit, rootGetters },
    { id, message }: { id: string; message: string[] }
  ) => {
    console.log('messages/send')
    const server: ServerConnection | undefined = rootGetters['servers/get'](id)
    if (!server) return // TODO error
    const peer = getPeer(server)
    peer?.sendMessage(message)
    commit('add', { id, sent: true, sentAt: Date.now(), message })
  }
}

export default actions
