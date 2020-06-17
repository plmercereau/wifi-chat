import { store } from 'src/store'
import { ServerConnection } from 'src/chat/types'
import { Ref, computed } from '@vue/composition-api'

export const useCall = (server: Ref<ServerConnection>) => {
  const call = (
    constraints: MediaStreamConstraints = {
      audio: true,
      video: true
    }
  ) => {
    store.dispatch('call/call', { id: server.value.id, constraints })
  }
  const calling = computed<boolean>(() => store.getters['call/calling'])
  const hangup = () => {
    store.dispatch('call/hangup', true)
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
