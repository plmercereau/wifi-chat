import { ActionTree } from 'vuex'
import { ServersStateInterface } from './state'

type DataName = {
  type: 'name'
  value: string
}

type DataMessage = {
  type: 'message'
  value: string
}
type DataAvatar = {
  type: 'avatar'
  value: string
}

type Data = DataName | DataMessage | DataAvatar

const actions: ActionTree<ServersStateInterface, {}> = {
  onData: (
    { state, commit, dispatch },
    { id, strData }: { id: string; strData: string }
  ) => {
    const data: Data = JSON.parse(strData)
    const server = state.servers.find(s => s.id === id)
    if (!server) return // TODO error
    const dataHandlers = {
      name: () => commit('update', { id, name: data.value }),
      avatar: () => commit('update', { id, avatar: data.value }),
      message: () =>
        dispatch(
          'messages/receive',
          { id, message: data.value },
          { root: true }
        )
    }
    dataHandlers[data.type]()
  }
}

export default actions
