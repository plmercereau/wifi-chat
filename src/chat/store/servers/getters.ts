import { GetterTree } from 'vuex'
import { ServersStateInterface } from './state'

const getters: GetterTree<ServersStateInterface, {}> = {
  all: state => Object.values(state.servers),
  list: state => Object.values(state.servers), // TODO not the archived / offline servers with no messages history
  get: state => (id: string) => state.servers[id]
}

export default getters
