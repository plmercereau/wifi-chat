import { computed, Ref } from '@vue/composition-api'
import { Store } from 'vuex'

import { GlobalState } from 'src/chat/store'
import { ServerConnection } from 'src/chat/types'

export const useServers = (store: Store<GlobalState>) =>
  computed<ServerConnection[]>(() => store.getters['connections/list'])

export const useServer = (store: Store<GlobalState>, id: Ref<string>) =>
  computed<ServerConnection>(() => store.getters['connections/get'](id.value))
