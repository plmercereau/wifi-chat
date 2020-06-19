import { WebSocketServer } from 'app/src-capacitor/node_modules/@ionic-native/web-socket-server'

import { SERVICE_PORT } from '../config'

import { log } from './utils'
import { getPeer, ExtendedPeer } from '../webrtc'
import { store } from 'src/store'
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

      WebSocketServer.watchOpen().subscribe(result => {
        log('(ws server) open connection.', result)
      })

      WebSocketServer.watchMessage().subscribe(result => {
        log(`(ws server) received message from ${result.conn.uuid}.`, result)
        const parsedData = JSON.parse(result.msg)
        if (parsedData.id) {
          log('(ws server) received ID', parsedData.id)
          if (store.getters['local/id'] === parsedData.id) {
            log('(ws server) loopback peer. Do nothing')
          } else {
            new ExtendedPeer({
              id: parsedData.id,
              initiator: true,
              signal: (message: string) => {
                WebSocketServer.send(result.conn, message)
              }
            })
            peerIds.set(result.conn.uuid, parsedData.id)
          }
        } else {
          log(
            '(ws server) trigger signal of peer id ',
            peerIds.get(result.conn.uuid)
          )
          const id = peerIds.get(result.conn.uuid)
          if (id) {
            const serverPeer = getPeer(id)
            if (serverPeer) serverPeer.signal(result.msg)
            else log('(ws server) peer not found')
          } else {
            log('(ws server) peer id not found.', peerIds)
          }
        }
      })
    })
  }
}
