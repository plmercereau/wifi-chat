import _Vue from 'vue'
import { computed } from '@vue/composition-api'
import { Store } from 'vuex'
import VuexPersistence from 'vuex-persist'

import localModule from './store/local'
import serversModule from './store/servers'
import messagesModule from './store/messages'
import callModule from './store/call'
import { ServerConnection } from './types'
import { startPoll } from './poll'

type StoreType = {}

export { useStart, useStop, EventBus } from './server'

export interface ChatPluginOptions {
  store: Store<StoreType>
}

export const useServers = (store: Store<StoreType>) =>
  computed<ServerConnection[]>(() => store.getters['servers/list'])

export function ChatPlugin(
  Vue: typeof _Vue,
  { store }: ChatPluginOptions
): void {
  store.registerModule('local', localModule)
  store.registerModule('servers', serversModule)
  store.registerModule('messages', messagesModule)
  store.registerModule('call', callModule)

  const vuexLocal = new VuexPersistence<StoreType>({
    storage: window.localStorage,
    modules: ['local', 'messages', 'servers']
  })
  vuexLocal.plugin(store)
  startPoll()
}
