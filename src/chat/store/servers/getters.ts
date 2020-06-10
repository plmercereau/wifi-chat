import { GetterTree } from 'vuex'
import { ServersStateInterface } from './state'

const getters: GetterTree<ServersStateInterface, {}> = {
  all: state => [...state.servers.values()],
  list: state => [...state.servers.values()], // TODO .filter(server => server.status !== 'offline'),
  get: state => (id: string) => state.servers.get(id)
}

export default getters
