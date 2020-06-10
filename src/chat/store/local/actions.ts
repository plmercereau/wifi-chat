import { ActionTree } from 'vuex'
import { LocalStateInterface } from './state'
import { getAllPeers } from 'src/chat/webrtc'

const actions: ActionTree<LocalStateInterface, {}> = {
  name: ({ commit, state }, name: string) => {
    if (name && name !== state.name) {
      commit('name', name)
      getAllPeers().forEach(peer => peer.sendName())
    }
  },
  avatar: ({ commit, state }, avatar: string) => {
    if (avatar && avatar !== state.avatar) {
      commit('avatar', avatar)
      getAllPeers().forEach(peer => peer.sendAvatar())
    }
  }
}

export default actions
