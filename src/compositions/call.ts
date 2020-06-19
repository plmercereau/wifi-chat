import { store } from 'src/store'
import { ServerConnection } from 'src/chat/types'
import { Ref, computed } from '@vue/composition-api'

export const useCall = (server: Ref<ServerConnection>) => {
  const call = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constraints: MediaStreamConstraints = {
      audio: true,
      video: true
    }
  ) => {
    store.dispatch('call/ring', { id: server.value.id, initiator: true })
  }
  const calling = computed<boolean>(() => store.getters['call/calling'])
  const hangup = () => {
    store.dispatch('call/hangup', { initiator: true })
  }
  const videoCall = () => {
    call()
  }
  const audioCall = () => {
    call({
      audio: true,
      video: false
    })
  }
  return { call, videoCall, audioCall, hangup, calling }
}
