import { ActionTree } from 'vuex'
import { CallStateInterface, CallOptions } from './state'
import { getPeer } from 'src/chat/webrtc'
import { log } from 'src/chat/switcher'

const actions: ActionTree<CallStateInterface, {}> = {
  ring: ({ commit, rootGetters }, { id, initiator }: CallOptions) => {
    log('dispatch call/ring')
    if (rootGetters['servers/get'](id)?.status === 'available') {
      if (initiator && id) getPeer(id)?.ring()
      commit('ring', { id, initiator })
    }
  },
  pickup: ({ commit, getters, dispatch }, { initiator }: CallOptions = {}) => {
    log('dispatch call/pickup')
    if (initiator && getters['remote']) getPeer(getters['remote'])?.pickup()
    commit('pickup')
    dispatch('local/status', 'busy', { root: true })
  },
  ready: ({ commit }) => {
    log('dispatch call/ready')
    commit('ready')
  },
  hangup: ({ commit, getters, dispatch }, { initiator }: CallOptions = {}) => {
    log('dispatch call/hangup')
    if (initiator && getters['remote']) getPeer(getters['remote'])?.hangup()
    commit('hangup')
    dispatch('local/status', 'available', { root: true })
  }
}

export default actions
