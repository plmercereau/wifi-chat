import { MutationTree } from 'vuex'
import moment from 'moment'
import { OrderedMap } from 'immutable'

import { MessagesStateInterface, initialState } from './state'
import { Message } from 'src/chat/types'
import { second, messageTime } from 'src/chat/utils'

const mutation: MutationTree<MessagesStateInterface> = {
  add: (state, { id, ...message }: { id: string } & Message) => {
    const messages = state.messages[id] || []
    messages.push(message)
    state.messages = { ...state.messages, [id]: messages }
  },

  reset(state) {
    Object.assign(state, initialState())
  }
}

export default mutation
