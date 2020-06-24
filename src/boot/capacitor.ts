import { defineCustomElements } from '@ionic/pwa-elements/loader'

export default async () => {
  await defineCustomElements(window)
}
