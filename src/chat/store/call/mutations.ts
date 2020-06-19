import { MutationTree } from 'vuex'
import { CallStateInterface, initialState, CallOptions } from './state'

const mutation: MutationTree<CallStateInterface> = {
  reset(state) {
    Object.assign(state, initialState())
  },
  ring: (state, { id, initiator }: CallOptions) => {
    console.log('mutation call/ring', id)
    state.status = 'ringing'
    state.remote = id
    state.initiator = !!initiator
  },
  pickup: state => {
    state.status = 'starting'
  },
  ready: state => {
    state.status = 'ongoing'
  },
  hangup: state => {
    state.status = 'pending'
    state.remote = undefined
    state.initiator = false
  }
}

export default mutation
