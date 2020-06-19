import { ActionTree } from 'vuex'
import { log } from 'src/chat/switcher'
import { getPeer } from '../../webrtc'
import { ServerConnection } from '../../types'
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
  }
}

export default actions
