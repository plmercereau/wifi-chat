import electron from 'electron'
import { Bonjour, Service, Browser } from 'bonjour'

import { Server, TxtTypes, WatchEvent } from '../types'
import { SERVICE_TYPE, APP_NAME, SERVICE_NAME, SERVICE_PORT } from '../config'

import { log } from './utils'

let bonjour: Bonjour | undefined

const getBonjour = () => {
  if (!bonjour)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    bonjour = electron.remote.require('bonjour')({
      loopback: process.env.NODE_ENV === 'development'
    })
  return bonjour as Bonjour
}

const bonjourToServer = (bonjourService: Service): Server | undefined => {
  const txt = bonjourService.txt as Partial<TxtTypes>
  if (txt.app !== APP_NAME || !txt.id) return
  return {
    id: (bonjourService.txt as TxtTypes).id,
    hostname: bonjourService.host,
    port: bonjourService.port,
    secure: bonjourService.protocol === 'https'
  }
}

let browser: Browser | undefined

export const watch = (onUp: WatchEvent, onDown: WatchEvent) => {
  log('(mdns) watch')
  browser = getBonjour().find(
    { type: SERVICE_TYPE, protocol: 'tcp' },
    service => {
      void onUp(bonjourToServer(service))
    }
  )
  browser.on('down', service => {
    void onDown(bonjourToServer(service))
  })
  browser.start()
}

export const unwatch = async () => {
  log('(mdns) unwatch')
  browser?.stop()
  return Promise.resolve()
}

export const unpublish = async () =>
  new Promise<void>(resolve => {
    log('(mdns) unpublish')
    if (bonjour) {
      bonjour.unpublishAll(() => {
        log('(mdns) unpublished all')
        bonjour?.destroy()
        resolve()
      })
    } else resolve()
  })

export const publish = async (id: string) => {
  electron.remote.app.on('will-quit', () => {
    // TODO check if it works
    log('(mdns) ELECTRON EVENT!!!!!!')
    void unpublish().then(() => {
      electron.remote.app.quit()
    })
  })
  const serviceOptions = {
    name: SERVICE_NAME,
    port: SERVICE_PORT,
    type: SERVICE_TYPE,
    txt: {
      app: APP_NAME,
      id
    }
  }
  log('(mdns) publish', serviceOptions)
  const service = getBonjour().publish(serviceOptions)
  log('(mdns) published', service)
  return Promise.resolve()
}
