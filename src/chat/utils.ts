import { Message } from './types'

export const second = (timestamp: number) => Math.floor(timestamp / 1000)
export const messageTime = (message: Message) =>
  message.receivedAt || message.sentAt || Date.now()
