import _Vue from 'vue'
import { computed } from '@vue/composition-api'
import { Store } from 'vuex'
import VuexPersistence from 'vuex-persist'

import localModule from './store/local'
import serversModule from './store/servers'
import messagesModule from './store/messages'
import callModule from './store/call'
import { ServerConnection, Status } from './types'
import { connect } from './webrtc'

type StoreType = {}

export { useStart, useStop, EventBus } from './server'

// declare module 'vue/types/vue' {
//   interface Vue {
//     $poll: NodeJS.Timeout
//   }
// }

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
  // TODO complete, reconnect, limit attempts...
  setInterval(() => {
    const status: Status = store.getters['local/status']
    if (status === 'available') {
      console.log(
        '(poll) local server available. browse disconnected servers...'
      )
      for (const server of store.getters[
        'servers/disconnected'
      ] as ServerConnection[]) {
        console.log(`(poll) trying to connect to ${server.id} ${server.name}`)
        connect(server, store)
          .then(() => {
            console.log(`(poll) connected to ${server.id}`)
          })
          .catch(() => {
            console.log(`(poll) impossible to connect to ${server.id}`)
          })
      }
    }
  }, 4000)

  // Vue.prototype.$poll = poll
}
