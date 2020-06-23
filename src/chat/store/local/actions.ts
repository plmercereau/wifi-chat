import { ActionTree } from 'vuex'
import moment from 'moment'
import { getAllPeers } from 'src/chat/webrtc'
import { Status, Locale } from 'src/chat/types'
import { log } from 'src/chat/switcher'
import { i18n } from 'src/boot/i18n'
import { LocalStateInterface } from './state'

const actions: ActionTree<LocalStateInterface, {}> = {
  name: ({ commit, state }, name: string) => {
    log('dispatch local/name')
    if (name && name !== state.name) {
      commit('name', name)
      getAllPeers().forEach(peer => peer.sendName())
    }
  },
  avatar: ({ commit, state }, avatar: string) => {
    log('dispatch local/avatar')
    if (avatar && avatar !== state.avatar) {
      commit('avatar', avatar)
      getAllPeers().forEach(peer => peer.sendAvatar())
    }
  },
  status: ({ commit, state }, status: Status) => {
    log('dispatch local/status', state.status, status)
    if (state.status !== status) {
      commit('status', status)
      getAllPeers().forEach(peer => peer.sendStatus(status))
    }
  },
  pickup: {
    root: true,
    handler: ({ dispatch }) => {
      log('dispatch local/pickup')
      dispatch('status', 'busy')
    }
  },
  hangup: {
    root: true,
    handler: ({ dispatch }) => {
      log('dispatch local/hangup')
      dispatch('status', 'available')
    }
  },
  locale: ({ commit, state }, locale?: Locale) => {
    log('dispatch local/locale')
    const newLocale =
      (locale && i18n.availableLocales.includes(locale) && locale) ||
      i18n.fallbackLocale.toString()
    if (newLocale !== state.locale) commit('locale', newLocale)
    i18n.locale = newLocale
    moment.locale(newLocale)
  },
  reset: {
    root: true,
    handler: ({ commit }) => {
      log('dispatch local/reset')
      commit('reset')
    }
  }
}

export default actions
