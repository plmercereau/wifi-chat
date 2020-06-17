import { MutationTree } from 'vuex'
import { LocalStateInterface, initialState } from './state'

const mutation: MutationTree<LocalStateInterface> = {
  reset(state) {
    Object.assign(state, initialState())
  },
  name: (state, name: string) => {
    state.name = name
  },
  start: state => {
    state.status = 'disconnected'
  },
  started: state => {
    state.status = 'available'
  },
  stop: state => {
    state.status = 'disconnected'
  },
  stopped: state => {
    state.status = 'offline'
  },
  avatar: (state, avatar: string) => {
    state.avatar = avatar
  }
}

export default mutation
