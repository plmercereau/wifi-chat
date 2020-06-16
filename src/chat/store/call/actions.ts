import { ActionTree } from 'vuex'
import { CallStateInterface } from './state'
import { getPeer } from 'src/chat/webrtc'

const actions: ActionTree<CallStateInterface, {}> = {
  // TODO ring = call with initiator=false
  ring: ({ commit }, { id }: { id: string }) => {
    console.log('call/ring')
    commit('ring', id)
  },
  call: ({ commit }, { id }: { id: string }) => {
    console.log('call/call')
    commit('call', id)
    const peer = getPeer(id)
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
  hangup: ({ commit, getters }, initiator = false) => {
    console.log('call/hangup')
    if (initiator) {
      console.log('call/hangup: initiator')
      if (getters['remote']) getPeer(getters['remote'])?.hangup()
    }
    commit('hangup')
  }
}

export default actions
