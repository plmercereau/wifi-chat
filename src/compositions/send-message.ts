import { Ref, ref } from '@vue/composition-api'
import { ServerConnection } from 'src/chat/types'
import { store } from 'src/store'

export const useSendMessage = (server: Ref<ServerConnection>) => {
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
