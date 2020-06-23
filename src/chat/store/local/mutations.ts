import { MutationTree } from 'vuex'

import { Status, Locale } from '../../types'
import { log } from '../../switcher'

import { LocalStateInterface, initialState } from './state'

const mutation: MutationTree<LocalStateInterface> = {
  reset(state) {
    log('commit local/reset')
    Object.assign(state, initialState())
  },
  name: (state, name: string) => {
    log('commit local/name')
    state.name = name
  },
  start: state => {
    log('commit local/start')
    state.status = 'disconnected'
  },
  started: state => {
    log('commit local/started')
    state.status = 'available'
  },
  stop: state => {
    log('commit local/stop')
    state.status = 'disconnected'
  },
  stopped: state => {
    log('commit local/stopped')
    state.status = 'disconnected'
  },
  status: (state, status: Status) => {
    log('commit local/status')
    state.status = status
  },
  avatar: (state, avatar: string) => {
    log('commit local/avatar')
    state.avatar = avatar
  },
  locale: (state, locale: Locale) => {
    log('commit local/locale')
    state.locale = locale
  }
}

export default mutation
