import { computed } from '@vue/composition-api'
import { store } from 'src/store'

export const useLocal = () => {
  const name = computed<string>(() => store.getters['local/name'])
  const avatar = computed<string>(() => store.getters['local/avatar'])
  const status = computed<string>(() => store.getters['local/status'])
  return { name, avatar, status }
}
