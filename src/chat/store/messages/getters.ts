import { GetterTree } from 'vuex'
import { MessagesStateInterface } from './state'
import { second, messageTime } from 'src/chat/utils'
import { OutputMessage } from 'src/chat/types'

const getters: GetterTree<MessagesStateInterface, {}> = {
  all: state => state.messages,
  get: state => (id: string) => {
    const messages = state.messages[id] || []
    const result: OutputMessage[] = []
    let lastTimeSpan = 0
    let lastSender = false
    let lastDay = 0
    let newMessage: OutputMessage | undefined = undefined
    for (const message of messages) {
      const timestamp = messageTime(message)
      const timeSpan = second(timestamp)
      const day = Math.floor(timestamp / (1000 * 60 * 60 * 24))
      if (day > lastDay) {
        result.push({ type: 'date', data: [], sent: false, timestamp })
        lastDay = day
      }
      if (timeSpan > lastTimeSpan + 3 || lastSender != message.sent) {
        const newSpan = !!newMessage
        newMessage = {
          type: 'message',
          timestamp,
          data: message.message,
          sent: message.sent
        }
        if (newSpan) result.push(newMessage)
        lastTimeSpan = timeSpan
        lastSender = message.sent
      } else if (newMessage?.data) {
        newMessage.data = [...newMessage.data, ...message.message]
      }
    }
    return result
  }
}

export default getters
