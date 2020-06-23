import { MutationTree } from 'vuex'

import { log } from '../../switcher'

import { CallStateInterface, initialState, CallOptions } from './state'

const mutation: MutationTree<CallStateInterface> = {
  reset: state => {
    log('(commit) call/reset')
    Object.assign(state, initialState())
  },
  ring: (state, { id, initiator }: CallOptions) => {
    log('(commit) call/ring', id, initiator)
    state.startedAt = undefined
    state.endedAt = undefined
    state.status = 'ringing'
    state.remote = id
    state.initiator = !!initiator
  },
  pickup: state => {
    log('(commit) call/pickup')
    state.startedAt = Date.now()
    state.status = 'starting'
  },
  ready: state => {
    log('(commit) call/ready')
    state.status = 'ongoing'
  },
  hangup: state => {
    log('(commit) call/hangup')
    state.startedAt = undefined
    state.endedAt = Date.now()
    state.status = 'pending'
    state.remote = undefined
    state.initiator = false
  }
}

export default mutation
