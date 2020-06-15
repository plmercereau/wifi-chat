import { GetterTree } from 'vuex'
import { CallStateInterface } from './state'

const getters: GetterTree<CallStateInterface, {}> = {
  ringing: state => state.ringing
}

export default getters
