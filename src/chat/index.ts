import _Vue from 'vue'
import { computed } from '@vue/composition-api'
import { Store } from 'vuex'
import VuexPersistence from 'vuex-persist'

import { ServerConnection } from './types'
import { startPoll } from './poll'
import { GlobalState, local, servers, messages, call } from './store'

export { useStart, useStop, EventBus } from './server'

export interface ChatPluginOptions {
  store: Store<GlobalState>
}

export const useServers = (store: Store<GlobalState>) =>
  computed<ServerConnection[]>(() => store.getters['servers/list'])

export function ChatPlugin(
  Vue: typeof _Vue,
  { store }: ChatPluginOptions
): void {
  store.registerModule('local', local)
  store.registerModule('servers', servers)
  store.registerModule('messages', messages)
  store.registerModule('call', call)

  const vuexLocal = new VuexPersistence<GlobalState>({
    storage: window.localStorage,
    reducer: state => ({
      messages: state.messages,
      local: state.local,
      servers: {
        servers: Object.keys(state.servers.servers).reduce<{
          [id: string]: ServerConnection
        }>((aggr, curs) => {
          aggr[curs] = {
            ...state.servers.servers[curs],
            status: 'disconnected'
          }
          return aggr
        }, {})
      }
    })
    // modules: ['local', 'messages', 'servers']
  })
  vuexLocal.plugin(store)
  store.dispatch('local/locale')
  startPoll()
}
