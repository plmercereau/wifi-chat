import { GetterTree } from 'vuex'
import { CallStateInterface } from './state'

const getters: GetterTree<CallStateInterface, {}> = {
  ringing: state => state.ringing && !!state.remote,
  ongoing: state => state.ongoing && !!state.remote,
  calling: state => state.calling && !!state.remote,
  remote: state => state.remote,
  stream: state => state.stream
}

export default getters
