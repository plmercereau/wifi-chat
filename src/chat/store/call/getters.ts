import { GetterTree } from 'vuex'
import { CallStateInterface } from './state'

const getters: GetterTree<CallStateInterface, unknown> = {
  ringing: state => state.status === 'ringing',
  receivingCall: state => !state.initiator && state.status === 'ringing',
  calling: state => state.initiator && state.status === 'ringing',
  starting: state => state.status === 'starting',
  ongoing: state => state.status === 'ongoing',
  remote: state => state.remote,
  startedAt: state => state.startedAt,
  endedAt: state => state.endedAt
}

export default getters
