import { Module } from 'vuex'
import state, { MessagesStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const vuexModule: Module<MessagesStateInterface, unknown> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default vuexModule
