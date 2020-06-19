import { ActionTree } from 'vuex'
import { CallStateInterface, CallOptions } from './state'
import { getPeer } from 'src/chat/webrtc'

const actions: ActionTree<CallStateInterface, {}> = {
  ring: ({ commit }, { id, initiator }: CallOptions) => {
    console.log('call/ring')
    if (initiator && id) getPeer(id)?.ring()
    commit('ring', { id, initiator })
  },
  pickup: ({ commit, getters }, { initiator }: CallOptions = {}) => {
    console.log('call/pickup')
    if (initiator && getters['remote']) getPeer(getters['remote'])?.pickup()
    commit('pickup')
  },
  ready: ({ commit }) => {
    console.log('call/ready')
    commit('ready')
  },
  hangup: ({ commit, getters }, { initiator }: CallOptions = {}) => {
    console.log('call/hangup')
    if (initiator && getters['remote']) getPeer(getters['remote'])?.hangup()
    commit('hangup')
  }
}

export default actions
