import { ActionTree } from 'vuex'
import { CallStateInterface, setStream, getStream } from './state'

const actions: ActionTree<CallStateInterface, {}> = {
  ring: ({ commit, state }, stream: MediaStream) => {
    if (!state.ringing) {
      commit('ring')
      setStream(stream)
    }
  },
  pickup: ({ commit, state }) => {
    const stream = getStream()
    commit('pickup')
  },
  hangup: ({ commit, state }) => {
    const stream = getStream()
    commit('hangup')
  }
}

export default actions
