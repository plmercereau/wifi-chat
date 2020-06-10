import { MutationTree } from 'vuex'
import { MessagesStateInterface, initialState } from './state'
import { Message } from 'src/chat/types'

const mutation: MutationTree<MessagesStateInterface> = {
  add: (state, { id, ...message }: { id: string } & Message) => {
    const messages = state.messages.get(id) || []
    state.messages = state.messages.set(id, [...messages, message])
  },

  reset(state) {
    Object.assign(state, initialState())
  }
}

export default mutation
