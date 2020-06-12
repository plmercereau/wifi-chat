import { GetterTree } from 'vuex'
import { MessagesStateInterface } from './state'

const getters: GetterTree<MessagesStateInterface, {}> = {
  all: state => state.messages,
  get: state => (id: string) => [...(state.messages.get(id)?.entries() || [])]
}

export default getters
