import { store as storeWrapper } from 'quasar/wrappers'

import Vuex, { Store } from 'vuex'
import { GlobalState } from 'src/chat/store'

let store: Store<GlobalState>

export default storeWrapper(function({ Vue }) {
  Vue.use(Vuex)

  store = new Vuex.Store<GlobalState>({
    modules: {},

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  })

  return store
})

export { store }
