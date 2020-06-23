/* eslint-disable quotes */
import { ActionTree } from 'vuex'
import moment from 'moment'

import { getAllPeers, disconnectAll } from '../../webrtc'
import { Status, Locale } from '../../types'
import {
  log,
  startServer,
  publish,
  watch,
  unwatch,
  unpublish,
  stopServer
} from '../../switcher'

// TODO break dependency to boot e.g. get the i18n instance when initialising the Vue plugin
import { i18n } from 'src/boot/i18n'

import { LocalStateInterface } from './state'
import { useAddServer, useRemoveServer, stopPoll, startPoll } from './utils'

const actions: ActionTree<LocalStateInterface, {}> = {
  name: ({ commit, state }, name: string) => {
    log('(dispatch) local/name')
    if (name && name !== state.name) {
      commit('name', name)
      getAllPeers().forEach(peer => peer.sendName())
    }
  },
  avatar: ({ commit, state }, avatar: string) => {
    log('(dispatch) local/avatar')
    if (avatar && avatar !== state.avatar) {
      commit('avatar', avatar)
      getAllPeers().forEach(peer => peer.sendAvatar())
    }
  },
  status: ({ commit, state }, status: Status) => {
    log('(dispatch) local/status', state.status, status)
    if (state.status !== status) {
      commit('status', status)
      getAllPeers().forEach(peer => peer.sendStatus(status))
    }
  },
  pickup: {
    root: true,
    handler: ({ dispatch }) => {
      log('(dispatch) local/pickup')
      dispatch('status', 'busy')
    }
  },
  hangup: {
    root: true,
    handler: ({ dispatch }) => {
      log('(dispatch) local/hangup')
      dispatch('status', 'available')
    }
  },
  locale: ({ commit, state }, locale?: Locale) => {
    log('(dispatch) local/locale')
    const newLocale =
      (locale && i18n.availableLocales.includes(locale) && locale) ||
      i18n.fallbackLocale.toString()
    if (newLocale !== state.locale) commit('locale', newLocale)
    i18n.locale = newLocale
    moment.locale(newLocale)
  },
  reset: {
    root: true,
    handler: async ({ commit, dispatch }) => {
      log('(dispatch) local/reset')
      await dispatch('stop')
      commit('reset')
    }
  },
  start: async context => {
    log('(dispatch) local/start')
    if (context.getters['name']) {
      context.commit('start')
      await startServer()
      await publish(context.getters['id'])
      watch(useAddServer(context), useRemoveServer(context))
      startPoll(context)
      context.commit('started')
    } else {
      log("(dispatch) local/start: user name doesn't exist")
    }
  },
  stop: async ({ commit }) => {
    log('(dispatch) local/stop')
    commit('stop')
    stopPoll()
    await unwatch()
    await unpublish()
    await stopServer()
    disconnectAll()
    commit('stopped')
  }
}

export default actions
