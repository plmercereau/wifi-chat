import { store } from 'src/store'
import { computed, ref } from '@vue/composition-api'
import moment from 'moment'

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
  const now = ref(Date.now())
  setInterval(() => {
    now.value = Date.now()
  }, 1000)

  const timer = computed(() =>
    moment(now.value - store.getters['call/startedAt'] - 1000 * 60 * 60).format(
      'HH:mm:ss'
    )
  )
  return { call, videoCall, audioCall, hangup, calling, timer }
}
