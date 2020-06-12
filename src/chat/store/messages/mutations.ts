import { MutationTree } from 'vuex'
import moment from 'moment'
import { OrderedMap } from 'immutable'

import { MessagesStateInterface, initialState } from './state'
import { Message } from 'src/chat/types'
import { second, messageTime } from 'src/chat/utils'

const mutation: MutationTree<MessagesStateInterface> = {
  add: (state, { id, ...message }: { id: string } & Message) => {
    const messages = state.messages.get(id) || OrderedMap<string, Message[]>()
    const day = moment(messageTime(message)).format('YYYY-MM-DD')
    const dayMessages = messages.get(day) || []
    const lastMessage = dayMessages[dayMessages.length - 1]
    if (
      lastMessage &&
      lastMessage.sent === message.sent &&
      second(messageTime(message)) <= second(messageTime(lastMessage)) + 3
    ) {
      lastMessage.message.push(...message.message)
      lastMessage.receivedAt = message.receivedAt
      lastMessage.sentAt = message.sentAt
    } else {
      dayMessages.push(message)
    }
    state.messages = state.messages.set(id, messages.set(day, dayMessages))
  },

  reset(state) {
    Object.assign(state, initialState())
  }
}

export default mutation
