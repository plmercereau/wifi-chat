import { store } from 'src/store'
import { computed } from '@vue/composition-api'

export const useCall = () => {
  const call = (
    id: string,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constraints: MediaStreamConstraints = {
      audio: true,
      video: true
    }
  ) => {
    store.dispatch('call/ring', { id, initiator: true })
  }
  const calling = computed<boolean>(() => store.getters['call/calling'])
  const hangup = () => {
    store.dispatch('call/hangup', { initiator: true })
  }
  const videoCall = (id: string) => {
    call(id)
  }
  const audioCall = (id: string) => {
    call(id, {
      audio: true,
      video: false
    })
  }
  return { call, videoCall, audioCall, hangup, calling }
}
