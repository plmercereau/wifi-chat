import { Message, ServerConnection } from './types'

export const second = (timestamp: number) => Math.floor(timestamp / 1000)
export const messageTime = (message: Message) =>
  message.receivedAt || message.sentAt || Date.now()

export const compareServerConnections = (
  a: ServerConnection,
  b: ServerConnection
) => {
  if (a.status === b.status) {
    if (a.name === b.name) return 0
    if (!a.name) return -1
    if (!b.name) return 1
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  }
  if (a.status === 'available') return -1
  if (b.status === 'available') return 1
  if (a.status === 'busy') return -1
  if (b.status === 'busy') return 1
  if (a.status === 'disconnected') return -1
  if (b.status === 'disconnected') return 1
  return 0
}
