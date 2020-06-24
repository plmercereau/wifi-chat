import { uid, Quasar } from 'quasar'

import { Status, Locale } from '../../types'

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
  locale: Quasar.lang.getLocale() as Locale
})

export default initialState()
