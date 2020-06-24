import { ActionTree } from 'vuex'

import { getPeer } from '../../webrtc'
import { log } from '../../switcher'

import { CallStateInterface, CallOptions } from './state'

const actions: ActionTree<CallStateInterface, unknown> = {
  ring: {
    root: true,
    handler: ({ commit, rootGetters }, { id, initiator }: CallOptions) => {
      log('(dispatch) call/ring')
      if (rootGetters['connections/get'](id)?.status === 'available') {
        if (initiator && id) getPeer(id)?.ring()
        commit('ring', { id, initiator })
      }
    }
  },
  pickup: {
    root: true,
    handler: ({ commit, getters }, { initiator }: CallOptions = {}) => {
      log('(dispatch) call/pickup')
      const id = getters['remote'] as string
      if (initiator && id) getPeer(id)?.pickup()
      commit('pickup')
    }
  },
  ready: ({ commit }) => {
    log('(dispatch) call/ready')
    commit('ready')
  },
  hangup: {
    root: true,
    handler: ({ commit, getters }, { initiator }: CallOptions = {}) => {
      log('(dispatch) call/hangup')
      const id = getters['remote'] as string
      if (initiator && id) getPeer(id)?.hangup()
      commit('hangup')
    }
  },
  reset: {
    root: true,
    handler: ({ commit }) => {
      log('(dispatch) call/reset')
      commit('reset')
    }
  }
}

export default actions
