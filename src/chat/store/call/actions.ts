import { ActionTree } from 'vuex'
import { CallStateInterface } from './state'
import { getPeer } from 'src/chat/webrtc'

const actions: ActionTree<CallStateInterface, {}> = {
  ring: ({ commit }, { id }: { id: string; stream: MediaStream }) => {
    console.log('call/ring')
    commit('ring', id)
  },
  call: ({ commit, rootGetters }, { id }: { id: string }) => {
    console.log('call/call')
    commit('call', id)
    const server = rootGetters['servers/get'](id)
    const peer = getPeer(server)
    peer?.call()
  },
  ready: ({ commit }, payload: { id: string }) => {
    console.log('call/ready')
    commit('ready', payload.id)
  },
  pickup: ({ commit }) => {
    console.log('call/pickup')
    commit('pickup')
  },
  hangup: ({ commit }) => {
    console.log('call/hangup')
    commit('hangup')
  }
}

export default actions
