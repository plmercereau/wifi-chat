import { ActionTree } from 'vuex'
import { ServersStateInterface } from './state'
import { Data } from 'src/chat/types'

const actions: ActionTree<ServersStateInterface, {}> = {
  onData: (
    { state, commit, dispatch },
    { id, strData }: { id: string; strData: string }
  ) => {
    const data: Data = JSON.parse(strData)
    const server = state.servers.find(s => s.id === id)
    if (!server) {
      console.log('servers/onData: no server found')
      return
    }
    const dataHandlers = {
      name: () => commit('update', { id, name: data.value }),
      avatar: () => commit('update', { id, avatar: data.value }),
      message: () =>
        dispatch(
          'messages/receive',
          { id, message: data.value },
          { root: true }
        ),
      status: () => commit('update', { id, status: data.value }),
      call: () => {
        if (data.value === 'hangup')
          dispatch('call/hangup', false, { root: true })
        else dispatch('call/ring', { id }, { root: true })
      }
    }
    dataHandlers[data.type]()
  }
}

export default actions
