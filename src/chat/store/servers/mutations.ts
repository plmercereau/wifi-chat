import { MutationTree } from 'vuex'
import { ServerConnection, Server } from '../../types'
import { ServersStateInterface, initialState } from './state'

const mutation: MutationTree<ServersStateInterface> = {
  add(state, server: Server) {
    console.log('servers/add', server)
    state.servers = {
      ...state.servers,
      [server.id]: {
        ...server,
        status: 'offline'
      }
    }
  },
  online: (state, id: string) => {
    console.log('servers/online')
    state.servers = {
      ...state.servers,
      [id]: { ...state.servers[id], status: 'disconnected' }
    }
  },
  remove(state, server: ServerConnection) {
    console.log('servers/remove')
    const servers = { ...state.servers }
    delete servers[server.id]
    state.servers = servers
  },
  update(state, server: { id: string } & Partial<ServerConnection>) {
    console.log('servers/update')
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
