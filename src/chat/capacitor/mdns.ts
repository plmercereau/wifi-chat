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
  log('hostname', hostname)
  return {
    id: (txtRecord as TxtTypes).id,
    hostname: hostname,
    port,
    secure: type === 'https' // ? not sure it works
  }
}

export const unpublish = async () => {
  log('unpublishing...')
  await Zeroconf.stop()
  log('Service unregistered')
}

export const publish = async (id: string) => {
  log('publishing...')
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
  log('Service registered', JSON.stringify(result))
}

export const watch = (onUp: WatchEvent, onDown: WatchEvent) => {
  Zeroconf.watch(`_${SERVICE_TYPE}._tcp.`, 'local.').subscribe(result => {
    if (result.action === 'added') {
      onUp(zeroconfToServer(result.service))
    } else if (result.action === 'resolved') {
      // TODO check if it works
      log('resolved service', result.service)
      onUp(zeroconfToServer(result.service))
    } else {
      onDown(zeroconfToServer(result.service))
    }
  })
}

export const unwatch = async () => {
  await Zeroconf.unwatch(`_${SERVICE_TYPE}._tcp.`, 'local.')
}
