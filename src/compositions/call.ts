import { store } from 'src/store'
import { ServerConnection } from 'src/chat/types'
import { Ref, computed } from '@vue/composition-api'

export const useCall = (server?: Ref<ServerConnection>) => {
  const call = (
    serverOrId: Ref<ServerConnection> | string | undefined = server,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constraints: MediaStreamConstraints = {
      audio: true,
      video: true
    }
  ) => {
    const id =
      typeof serverOrId === 'string' ? serverOrId : serverOrId?.value.id
    store.dispatch('call/ring', { id, initiator: true })
  }
  const calling = computed<boolean>(() => store.getters['call/calling'])
  const hangup = () => {
    store.dispatch('call/hangup', { initiator: true })
  }
  const videoCall = (
    s: Ref<ServerConnection> | string | undefined = server
  ) => {
    call(s)
  }
  const audioCall = (
    s: Ref<ServerConnection> | string | undefined = server
  ) => {
    call(s, {
      audio: true,
      video: false
    })
  }
  return { call, videoCall, audioCall, hangup, calling }
}
