import { MutationTree } from 'vuex'
import { LocalStateInterface, initialState } from './state'

const mutation: MutationTree<LocalStateInterface> = {
  reset(state) {
    Object.assign(state, initialState())
  },
  name: (state, name: string) => {
    state.name = name
  }
}

export default mutation
