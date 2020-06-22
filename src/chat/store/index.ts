import { ServersStateInterface } from './servers/state'
import { MessagesStateInterface } from './messages/state'
import { LocalStateInterface } from './local/state'
import { CallStateInterface } from './call/state'
import local from './local'
import servers from './servers'
import messages from './messages'
import call from './call'

export type GlobalState = {
  servers: ServersStateInterface
  messages: MessagesStateInterface
  local: LocalStateInterface
  call: CallStateInterface
}

export { local, servers, messages, call }
