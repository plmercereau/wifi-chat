import { GetterTree } from 'vuex'
import { CallStateInterface } from './state'

const getters: GetterTree<CallStateInterface, {}> = {
  ringing: state => state.ringing && !!state.remote,
  calling: state => state.calling && !!state.remote,
  remote: (state, _, __, rootGetters) =>
    state.remote && rootGetters['servers/get'](state.remote),
  stream: state => state.stream
}

export default getters
