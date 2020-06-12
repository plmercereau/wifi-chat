import { Server, Message } from './types'

export const compareServers = (a: Server, b: Server) => a.id === b.id
// a.hostname === b.hostname && a.port === b.port

export const second = (timestamp: number) => Math.floor(timestamp / 1000)
export const messageTime = (message: Message) =>
  message.receivedAt || message.sentAt || Date.now()
