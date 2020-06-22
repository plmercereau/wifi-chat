import { MutationTree } from 'vuex'
import { ServerConnection, Server } from '../../types'
import { ServersStateInterface, initialState } from './state'

const mutation: MutationTree<ServersStateInterface> = {
  add(state, server: Server) {
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
    console.log('commit servers/remove')
    const servers = { ...state.servers }
    delete servers[id]
    state.servers = servers
  },
  update(state, server: { id: string } & Partial<ServerConnection>) {
    console.log('commit servers/update')
    state.servers = {
      ...state.servers,
      [server.id]: { ...state.servers[server.id], ...server }
    }
  },
  reset(state) {
    Object.assign(state, initialState())
  }
}

export default mutation
