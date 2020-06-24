import enUS from './en-us.json'
import fr from './fr.json'
import { Quasar } from 'quasar'

const defaultLocale = 'en-us'
const messages = {
  'en-us': enUS,
  fr
}
export default {
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages
}

export const options = [
  { value: 'en-us', label: '🇬🇧 English' },
  { value: 'fr', label: '🇫🇷 Français' }
]

export const getInitialLocale = () => {
  const locale = Quasar.lang.getLocale() as string
  if (Object.keys(messages).includes(locale)) return locale
  else return defaultLocale
}
