import { GetterTree } from 'vuex'
import { ServersStateInterface } from './state'

const getters: GetterTree<ServersStateInterface, {}> = {
  all: state => [...state.servers.values()],
  list: state => [...state.servers.values()], // TODO not the archived / offline servers with no messages history
  get: state => (id: string) => state.servers.get(id)
}

export default getters
