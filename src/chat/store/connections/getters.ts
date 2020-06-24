import { GetterTree } from 'vuex'

import { getPeer } from '../../webrtc'
import { compareServerConnections } from '../../utils'

import { ServersStateInterface } from './state'

const getters: GetterTree<ServersStateInterface, unknown> = {
  all: state => Object.values(state.servers),
  disconnected: state =>
    Object.values(state.servers).filter(
      ({ id, status }) => status === 'disconnected' || !getPeer(id)
    ),
  list: state =>
    Object.values(state.servers)
      .filter(({ id, status }) => status !== 'archived' || getPeer(id))
      .sort(compareServerConnections),
  get: state => (id: string) => state.servers[id]
}

export default getters
