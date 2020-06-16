import { MutationTree } from 'vuex'
import { CallStateInterface, initialState } from './state'

const mutation: MutationTree<CallStateInterface> = {
  reset(state) {
    Object.assign(state, initialState())
  },
  call: (state, id) => {
    state.remote = id
    state.calling = true
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
    state.ongoing = true
    state.calling = false
  },
  pickup: state => {
    state.ringing = false
    state.ongoing = true
    state.calling = false
  },
  hangup: state => {
    state.ongoing = false
    state.ringing = false
    state.calling = false
    state.stream = false
    state.remote = undefined
  }
}

export default mutation
