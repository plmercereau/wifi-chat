import _Vue from 'vue'
import { Store } from 'vuex'
import VuexPersistence from 'vuex-persist'

import { ServerConnection } from './types'
import { GlobalState, local, connections, messages, call } from './store'

export interface ChatPluginOptions {
  store: Store<GlobalState>
}

let store: Store<GlobalState>

export function ChatPlugin(
  Vue: typeof _Vue,
  { store: vuexStore }: ChatPluginOptions
): void {
  store = vuexStore
  store.registerModule('local', local)
  store.registerModule('connections', connections)
  store.registerModule('messages', messages)
  store.registerModule('call', call)

  const vuexLocal = new VuexPersistence<GlobalState>({
    storage: window.localStorage,
    reducer: state => ({
      messages: state.messages,
      local: state.local,
      connections: {
        connections: Object.keys(state.connections.servers).reduce<{
          [id: string]: ServerConnection
        }>((aggr, curs) => {
          // * Persist only servers with names
          if (state.connections.servers[curs].name)
            aggr[curs] = {
              ...state.connections.servers[curs],
              // * Set persisted status to 'disconnected'
              status: 'disconnected'
            }
          return aggr
        }, {})
      }
    })
  })
  vuexLocal.plugin(store)
  void store.dispatch('local/locale')
}

export const getStore = () => store
