import { MutationTree } from 'vuex'

import { ServerConnection, Server } from '../../types'
import { log } from '../../switcher'

import { ServersStateInterface, initialState } from './state'

const mutation: MutationTree<ServersStateInterface> = {
  add(state, server: Server) {
    log('(commit) connections/add')
    console.log('(commit) connections/add', server)
    state.servers = {
      ...state.servers,
      [server.id]: {
        ...server,
        status: 'disconnected'
      }
    }
  },
  remove(state, id: string) {
    log('(commit) connections/remove')
    const servers = { ...state.servers }
    delete servers[id]
    state.servers = servers
  },
  update(state, server: { id: string } & Partial<ServerConnection>) {
    log('(commit) connections/update')
    state.servers = {
      ...state.servers,
      [server.id]: { ...state.servers[server.id], ...server }
    }
  },
  reset(state) {
    log('(commit) connections/reset')
    Object.assign(state, initialState())
  }
}

export default mutation
