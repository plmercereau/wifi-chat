import WebSocket from 'ws'
// import electron from 'electron'
const WS = window.require('ws')

import { store } from '../../store'

import { ExtendedPeer, getPeer } from '../webrtc'
import { SERVICE_PORT } from '../config'

import { log } from './utils'

let wss: WebSocket.Server | undefined

export const stopServer = () =>
  new Promise<void>((resolve, reject) => {
    log('stop ws server')
    if (wss) {
      for (const client of wss.clients) {
        client.close()
      }
      wss.close(err => {
        if (err) reject(err)
        else resolve()
      })
    } else resolve()
  })

export const startServer = async () => {
  try {
    await stopServer()
  } finally {
    log('(ws server) start')
    const wss = new WS.Server({ port: SERVICE_PORT }) as WebSocket.Server
    const peerIds: Map<WebSocket, string> = new Map()

    wss.on('connection', ws => {
      log('(ws server) connection')

      ws.on('message', data => {
        const parsedData = JSON.parse(data.toString())
        log('(ws server) received message. parsed data:', parsedData)
        if (parsedData.id) {
          log('(ws server) received ID', parsedData.id)
          if (store.getters['local/id'] === parsedData.id) {
            log('(ws server) loopback peer. Do nothing')
          } else {
            new ExtendedPeer({
              id: parsedData.id,
              initiator: true,
              signal: (message: string) => {
                ws.send(message)
              }
            })
            peerIds.set(ws, parsedData.id)
          }
        } else {
          log('(ws server) trigger signal of peer id ', peerIds.get(ws))
          const id = peerIds.get(ws)
          if (id) {
            const serverPeer = getPeer(id)
            if (serverPeer) serverPeer.signal(data.toString())
            else log('(ws server) peer not found')
          } else {
            log('(ws server) peer id not found.', peerIds)
          }
        }
      })
    })
    wss.on('error', error => {
      log('wss error', error)
    })
    return Promise.resolve()
  }
}
