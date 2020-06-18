import { ActionTree } from 'vuex'
import { ServersStateInterface } from './state'
import { Data, Status } from 'src/chat/types'

const actions: ActionTree<ServersStateInterface, {}> = {
  onData: (
    { commit, dispatch },
    { id, strData }: { id: string; strData: string }
  ) => {
    const data: Data = JSON.parse(strData)
    const dataHandlers = {
      name: () => commit('update', { id, name: data.value }),
      avatar: () => commit('update', { id, avatar: data.value }),
      message: () =>
        dispatch(
          'messages/receive',
          { id, message: data.value },
          { root: true }
        ),
      status: () => dispatch('status', { id, status: data.value }),
      call: () => {
        if (data.value === 'hangup')
          dispatch('call/hangup', false, { root: true })
        else dispatch('call/ring', { id }, { root: true })
      }
    }
    dataHandlers[data.type]()
  },
  status: ({ commit }, { id, status }: { id: string; status: Status }) => {
    commit('update', { id, status: status })
  }
}

export default actions
