import { GetterTree } from 'vuex'
import { LocalStateInterface } from './state'

const getters: GetterTree<LocalStateInterface, {}> = {
  id: state => state.id,
  name: state => state.name,
  avatar: state => state.avatar
}

export default getters
