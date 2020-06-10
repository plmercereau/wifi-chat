import { Module } from 'vuex'
import state, { ServersStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const vuexModule: Module<ServersStateInterface, {}> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default vuexModule
