import {
  Zeroconf,
  ZeroconfService
} from 'app/src-capacitor/node_modules/@ionic-native/zeroconf'
import { WatchEvent, Server, TxtTypes } from '../types'
import { SERVICE_PORT, APP_NAME, SERVICE_TYPE, SERVICE_NAME } from '../config'
import { log } from './utils'

Zeroconf.registerAddressFamily = 'ipv4'

const zeroconfToServer = ({
  hostname,
  port,
  ipv4Addresses,
  type,
  txtRecord
}: ZeroconfService): Server | undefined => {
  const txt = txtRecord as Partial<TxtTypes>
  if (txt.app !== APP_NAME || !txt.id) return
  if (!hostname || hostname.startsWith('unknown')) hostname = ipv4Addresses[0]

  if (!hostname) return
  log('(mdns) hostname', hostname)
  return {
    id: (txtRecord as TxtTypes).id,
    hostname: hostname,
    port,
    secure: type === 'https' // ? not sure it works
  }
}

export const unpublish = async () => {
  log('(mdns) unpublish')
  await Zeroconf.stop()
  log('(mdns) service unregistered')
}

export const publish = async (id: string) => {
  log('(mdns) publish')
  await unpublish()
  const result = await Zeroconf.register(
    `_${SERVICE_TYPE}._tcp.`,
    'local.',
    SERVICE_NAME,
    SERVICE_PORT,
    {
      app: APP_NAME,
      id
    }
  )
  log('(mdns) service registered', JSON.stringify(result))
}

export const watch = (onUp: WatchEvent, onDown: WatchEvent) => {
  log('(mdns) watch')
  Zeroconf.watch(`_${SERVICE_TYPE}._tcp.`, 'local.').subscribe(result => {
    if (result.action === 'added') {
      void onUp(zeroconfToServer(result.service))
    } else if (result.action === 'resolved') {
      log('(mdns) resolved service', result.service)
      void onUp(zeroconfToServer(result.service))
    } else {
      void onDown(zeroconfToServer(result.service))
    }
  })
}

export const unwatch = async () => {
  log('(mdns) unwatch')
  await Zeroconf.unwatch(`_${SERVICE_TYPE}._tcp.`, 'local.')
}
