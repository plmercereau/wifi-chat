import { computed, Ref } from '@vue/composition-api'
import { ServerConnection } from 'src/chat/types'
import { store } from 'src/store'

export const useServer = (id: Ref<string>) =>
  computed<ServerConnection>(() => store.getters['servers/get'](id.value))
