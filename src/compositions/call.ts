import { computed } from '@vue/composition-api'
import { Store } from 'vuex'

import { GlobalState } from 'src/chat/store'

export const useCall = (store: Store<GlobalState>) => {
  const call = async (
    id: string,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constraints: MediaStreamConstraints = {
      audio: true,
      video: true
    }
  ) => {
    await store.dispatch('ring', { id, initiator: true })
  }
  const calling = computed<boolean>(() => store.getters['call/calling'])
  const hangup = async () => {
    await store.dispatch('hangup', { initiator: true })
  }
  const videoCall = async (id: string) => {
    await call(id)
  }
  const audioCall = async (id: string) => {
    await call(id, {
      audio: true,
      video: false
    })
  }
  const startedAt = computed(() => store.getters['call/startedAt'])
  return { call, videoCall, audioCall, hangup, calling, startedAt }
}
