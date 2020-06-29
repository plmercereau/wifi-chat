import { uid } from 'quasar'

import { Status, Locale } from '../../types'
import { getInitialLocale } from 'src/i18n'

export interface LocalStateInterface {
  id: string
  name?: string
  avatar?: string
  status: Status
  locale: Locale
  constraints: MediaStreamConstraints
}

export const initialState = (): LocalStateInterface => ({
  id: uid(),
  name: undefined,
  avatar: undefined,
  status: 'disconnected',
  locale: getInitialLocale() as Locale,
  constraints: {
    video: {
      facingMode: 'user' // TODO or environment
    },
    audio: true
  }
})

export default initialState()
