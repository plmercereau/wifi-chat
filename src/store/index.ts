import { store as storeWrapper } from 'quasar/wrappers'

import Vuex, { Store } from 'vuex'

// import example from './module-example';
// import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StoreInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  // example: unknown;
}

let store: Store<StoreInterface>

export default storeWrapper(function({ Vue }) {
  Vue.use(Vuex)

  store = new Vuex.Store<StoreInterface>({
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
