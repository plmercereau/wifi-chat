import { Ref, computed } from '@vue/composition-api'
import { ServerConnection, OutputMessage } from 'src/chat/types'
import { store } from 'src/store'

export const useMessages = (server: Ref<ServerConnection>) =>
  computed<OutputMessage[]>(() =>
    store.getters['messages/get'](server.value.id)
  )
