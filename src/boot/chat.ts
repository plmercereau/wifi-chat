import { boot } from 'quasar/wrappers'
import { ChatPlugin } from 'src/chat'

import { Dark } from 'quasar'
if (process.env.MODE === 'electron') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const remote = require('electron').remote
  if (remote.nativeTheme.shouldUseDarkColors) Dark.set(true)
}

export default boot(({ Vue, store }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  Vue.use(ChatPlugin, { store })
})
