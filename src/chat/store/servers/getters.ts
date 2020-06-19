import { GetterTree } from 'vuex'
import { ServersStateInterface } from './state'
import { getPeer } from 'src/chat/webrtc'

const getters: GetterTree<ServersStateInterface, {}> = {
  all: state => Object.values(state.servers),
  disconnected: state =>
    Object.values(state.servers).filter(
      ({ id, status }) => status === 'disconnected' || !getPeer(id)
    ),
  list: state =>
    Object.values(state.servers).filter(
      ({ id, status }) => status !== 'archived' || getPeer(id)
    ),
  get: state => (id: string) => state.servers[id]
}

export default getters
