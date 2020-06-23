import { GetterTree } from 'vuex'
import { LocalStateInterface } from './state'

const getters: GetterTree<LocalStateInterface, {}> = {
  id: state => state.id,
  name: state => state.name,
  avatar: state => state.avatar,
  status: state => state.status,
  locale: state => state.locale
}

export default getters
