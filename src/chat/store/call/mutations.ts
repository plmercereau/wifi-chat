import { MutationTree } from 'vuex'
import { CallStateInterface, initialState } from './state'

const mutation: MutationTree<CallStateInterface> = {
  reset(state) {
    Object.assign(state, initialState())
  },
  call: (state, id) => {
    state.remote = id
  },
  ring: (state, id) => {
    console.log('mutation call/ring', id)
    state.ringing = true
    state.remote = id
  },
  ready: (state, id) => {
    if (id) state.remote = id
    state.stream = true
    state.ringing = false
    state.calling = true
  },
  pickup: state => {
    state.ringing = false
    state.calling = true
  },
  hangup: state => {
    state.calling = false
    state.ringing = false
    state.remote = undefined
  }
}

export default mutation
