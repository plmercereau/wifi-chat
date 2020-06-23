import { MutationTree } from 'vuex'
import { ServerConnection, Server } from '../../types'
import { ServersStateInterface, initialState } from './state'
import { log } from 'src/chat/switcher'

const mutation: MutationTree<ServersStateInterface> = {
  add(state, server: Server) {
    log('commit servers/add')
    console.log('commit servers/add', server)
    state.servers = {
      ...state.servers,
      [server.id]: {
        ...server,
        status: 'disconnected'
      }
    }
  },
  remove(state, id: string) {
    log('commit servers/remove')
    const servers = { ...state.servers }
    delete servers[id]
    state.servers = servers
  },
  update(state, server: { id: string } & Partial<ServerConnection>) {
    log('commit servers/update')
    state.servers = {
      ...state.servers,
      [server.id]: { ...state.servers[server.id], ...server }
    }
  },
  reset(state) {
    log('commit servers/reset')
    Object.assign(state, initialState())
  }
}

export default mutation
