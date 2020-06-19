import { GetterTree } from 'vuex'
import { CallStateInterface } from './state'

const getters: GetterTree<CallStateInterface, {}> = {
  ringing: state => state.status === 'ringing',
  receivingCall: state => !state.initiator && state.status === 'ringing',
  calling: state => state.initiator && state.status === 'ringing',
  starting: state => state.status === 'starting',
  ongoing: state => state.status === 'ongoing',
  remote: state => state.remote
}

export default getters
