import { Status, Locale } from 'src/chat/types'
import { uid, Quasar } from 'quasar'
export interface LocalStateInterface {
  id: string
  name?: string
  avatar?: string
  status: Status
  locale: Locale
}

export const initialState = (): LocalStateInterface => ({
  id: uid(),
  name: undefined,
  avatar: undefined,
  status: 'disconnected',
  locale: Quasar.lang.getLocale()
})

export default initialState()
