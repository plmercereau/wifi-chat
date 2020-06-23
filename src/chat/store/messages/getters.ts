import { GetterTree } from 'vuex'

import { second, messageTime } from '../../utils'
import { OutputMessage } from '../../types'

import { MessagesStateInterface } from './state'

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
      if (message.type === 'message') {
        const timestamp = messageTime(message)
        const timeSpan = second(timestamp)
        const day = Math.floor(timestamp / (1000 * 60 * 60 * 24))
        if (day > lastDay) {
          result.push({
            type: 'date',
            data: [],
            sent: false,
            timestamp: timestamp - 1
          })
          lastDay = day
        }
        if (timeSpan > lastTimeSpan + 3 || lastSender != message.sent) {
          newMessage = {
            type: 'message',
            timestamp,
            data: message.message,
            sent: message.sent
          }
          result.push(newMessage)
          lastTimeSpan = timeSpan
          lastSender = message.sent
        } else if (newMessage?.data) {
          newMessage.data = [...newMessage.data, ...message.message]
        }
      } else {
        // TODO call history
        // if (message.message[0] === 'start')
        //   result.push({
        //     type: 'call',
        //     data: ['call started at'],
        //     timestamp: message.receivedAt || 0,
        //     sent: false
        //   })
      }
    }

    return result
  }
}

export default getters
