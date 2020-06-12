import _Vue from 'vue'
import { computed } from '@vue/composition-api'
import { Store } from 'vuex'
import VuexPersistence from 'vuex-persist'

import localModule from './store/local'
import serversModule from './store/servers'
import messagesModule from './store/messages'
import { ServerConnection } from './types'
import { log, checkServer } from './switcher'
import { store } from 'quasar/wrappers'

type StoreType = {}

export { useStart, useStop, EventBus } from './server'

declare module 'vue/types/vue' {
  interface Vue {
    $poll: NodeJS.Timeout
  }
}

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

  // TODO make messages serialisable. See https://github.com/championswimmer/vuex-persist/issues/112
  const vuexLocal = new VuexPersistence<StoreType>({
    storage: window.localStorage,
    modules: ['local', 'messages']
  })
  vuexLocal.plugin(store)
  // TODO complete, reconnect, limit attempts...
  const poll = setInterval(() => {
    for (const server of store.getters['servers/all'] as ServerConnection[]) {
      if (server.status === 'offline') {
        checkServer(server).then(result => {
          if (result) {
            log('Server is up')
            server.status = 'disconnected'
            store.commit('servers/add', server)
          }
        })
      }
    }
  }, 3000)

  Vue.prototype.$poll = poll
}
