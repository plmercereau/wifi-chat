import { computed } from '@vue/composition-api'
import { Store } from 'vuex'

import { GlobalState } from 'src/chat/store'

export const useLocal = (store: Store<GlobalState>) => {
  const name = computed<string>(() => store.getters['local/name'])
  const avatar = computed<string>(() => store.getters['local/avatar'])
  const status = computed<string>(() => store.getters['local/status'])
  return { name, avatar, status }
}
