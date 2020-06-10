import { boot } from 'quasar/wrappers'
import { ChatPlugin } from 'src/chat'

import { Dark } from 'quasar'
if (process.env.MODE === 'electron') {
  const remote = require('electron').remote
  if (remote.nativeTheme.shouldUseDarkColors) Dark.set(true)
}

export default boot(({ Vue, store }) => {
  Vue.use(ChatPlugin, { store })
})
