import { Ref, computed, ref } from '@vue/composition-api'
import { Store } from 'vuex'

import { GlobalState } from 'src/chat/store'
import { ServerConnection, OutputMessage } from 'src/chat/types'

export const useMessages = (
  store: Store<GlobalState>,
  server: Ref<ServerConnection>
) =>
  computed<OutputMessage[]>(() =>
    store.getters['messages/get'](server.value.id)
  )

export const useSendMessage = (
  store: Store<GlobalState>,
  server: Ref<ServerConnection>
) => {
  const message = ref('')
  const send = () => {
    if (!message.value) return
    store.dispatch('messages/send', {
      id: server.value.id,
      message: [message.value]
    })
    message.value = ''
  }
  return { message, send }
}
