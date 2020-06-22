import { store as storeWrapper } from 'quasar/wrappers'

import Vuex, { Store } from 'vuex'
import { GlobalState } from 'src/chat/store'

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

let store: Store<GlobalState>

export default storeWrapper(function({ Vue }) {
  Vue.use(Vuex)

  store = new Vuex.Store<GlobalState>({
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  })

  return store
})

export { store }
