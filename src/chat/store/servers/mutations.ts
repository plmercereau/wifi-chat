import { MutationTree } from 'vuex'
import { ServerConnection, Server } from '../../types'
import { ServersStateInterface, initialState } from './state'

const mutation: MutationTree<ServersStateInterface> = {
  add(state, server: Server) {
    console.log('servers/add')
    const serverConnection: ServerConnection = {
      ...server,
      status: 'offline'
    }
    state.servers = state.servers.set(server.id, serverConnection)
  },
  online: (state, id: string) => {
    console.log('servers/online')
    const serverConnection = state.servers.get(id)
    if (serverConnection)
      state.servers = state.servers.set(id, {
        ...serverConnection,
        status: 'disconnected'
      })
  },
  available: (state, id: string) => {
    console.log('servers/available')
    const serverConnection = state.servers.get(id)
    if (serverConnection)
      state.servers = state.servers.set(id, {
        ...serverConnection,
        status: 'available'
      })
  },
  remove(state, server: ServerConnection) {
    console.log('servers/remove')
    state.servers = state.servers.delete(server.id)
  },
  update(state, { id, ...server }: { id: string } & Partial<ServerConnection>) {
    console.log('servers/update')
    const oldValue = state.servers.get(id)
    if (!oldValue) return
    const newValue = { ...oldValue, ...server }
    state.servers = state.servers.set(id, newValue)
  },
  reset(state) {
    Object.assign(state, initialState())
  }
}

export default mutation
