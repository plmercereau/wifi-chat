import { Module } from 'vuex'
import state, { LocalStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const vuexModule: Module<LocalStateInterface, unknown> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default vuexModule
