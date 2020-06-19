import { MutationTree } from 'vuex'
import { Message } from 'src/chat/types'
import { log } from 'src/chat/switcher'
import { MessagesStateInterface, initialState } from './state'

const mutation: MutationTree<MessagesStateInterface> = {
  add: (state, { id, ...message }: { id: string } & Message) => {
    log('commit messages/add', id, message)
    const messages = state.messages[id] || []
    messages.push(message)
    state.messages = { ...state.messages, [id]: messages }
  },

  reset(state) {
    log('commit messages/reset')
    Object.assign(state, initialState())
  }
}

export default mutation
