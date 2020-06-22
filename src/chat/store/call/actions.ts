import { ActionTree } from 'vuex'
import { CallStateInterface, CallOptions } from './state'
import { getPeer } from 'src/chat/webrtc'
import { log } from 'src/chat/switcher'

const actions: ActionTree<CallStateInterface, {}> = {
  ring: {
    root: true,
    handler: ({ commit, rootGetters }, { id, initiator }: CallOptions) => {
      log('dispatch call/ring')
      if (rootGetters['servers/get'](id)?.status === 'available') {
        if (initiator && id) getPeer(id)?.ring()
        commit('ring', { id, initiator })
      }
    }
  },
  pickup: {
    root: true,
    handler: ({ commit, getters }, { initiator }: CallOptions = {}) => {
      log('dispatch call/pickup')
      const id = getters['remote']
      if (initiator && id) getPeer(id)?.pickup()
      commit('pickup')
    }
  },
  ready: ({ commit }) => {
    log('dispatch call/ready')
    commit('ready')
  },
  hangup: {
    root: true,
    handler: ({ commit, getters }, { initiator }: CallOptions = {}) => {
      log('dispatch call/hangup')
      const id = getters['remote']
      if (initiator && id) getPeer(id)?.hangup()
      commit('hangup')
    }
  }
}

export default actions
