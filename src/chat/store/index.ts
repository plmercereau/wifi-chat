import { ServersStateInterface } from './connections/state'
import { MessagesStateInterface } from './messages/state'
import { LocalStateInterface } from './local/state'
import { CallStateInterface } from './call/state'
import local from './local'
import connections from './connections'
import messages from './messages'
import call from './call'

export type GlobalState = {
  connections: ServersStateInterface
  messages: MessagesStateInterface
  local: LocalStateInterface
  call: CallStateInterface
}

export { local, connections, messages, call }
