import { WebSocketServer } from 'app/src-capacitor/node_modules/@ionic-native/web-socket-server'

import { SERVICE_PORT } from '../config'

import { log } from './utils'
import { getPeer } from '../webrtc'
export const stopServer = async () => {
  log('stop ws server')
  await WebSocketServer.stop()
}

export const startServer = async () => {
  try {
    await stopServer()
  } finally {
    log('start ws server')
    return new Promise<void>((resolve, reject) => {
      const peerIds: Map<string, string> = new Map()
      WebSocketServer.start(SERVICE_PORT, {}).subscribe({
        next: server => {
          log(`listening to port ${server.addr}:${server.port}...`)
          resolve()
        },
        error: error => {
          log('Unexpected error', error)
          reject(error)
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      WebSocketServer.watchOpen().subscribe(result => {
        // TODO
      })
      WebSocketServer.watchMessage().subscribe(result => {
        console.log(`Received message ${result.msg} from ${result.conn.uuid}`)
        const parsedData = JSON.parse(result.msg)

        if (parsedData.id) {
          // const peer = new ExtendedPeer({ id: parsedData.id, store, ws: (0 as unknown) as WebSocket })
          // TODO peer.on('signal', () => ...)
        } else {
          const peerId = peerIds.get(result.conn.uuid)
          console.log('trigger signal')
          if (peerId) getPeer(peerId)?.signal(result.msg)
        }
      })
    })
  }
}
