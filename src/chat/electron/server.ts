import http from 'http'

import { SERVICE_PORT } from '../config'

import { log } from './utils'
import WebSocket from 'isomorphic-ws'
import electron from 'electron'
const WS = electron.remote.require('ws')

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
    }
    resolve()
  })

import { ExtendedPeer, setPeer, getPeer } from '../webrtc'
import { store } from '../../store'

export const startServer = async () => {
  try {
    await stopServer()
  } finally {
    log('start ws server')
    const wss = new WS.Server({ port: SERVICE_PORT }) as WebSocket.Server
    const peerIds: Map<WebSocket, string> = new Map()
    wss.on('connection', ws => {
      ws.addEventListener('message', ({ data }) => {
        console.log('ws message', data)
        const parsedData = JSON.parse(data)
        if (parsedData.id) {
          new ExtendedPeer({ id: parsedData.id, ws, store })
          // ? update store?
          peerIds.set(ws, parsedData.id)
        } else {
          console.log('trigger signal')
          const id = peerIds.get(ws)
          if (id) getPeer(id)?.signal(data)
        }
      })
    })
    wss.on('error', error => {
      console.log('wss error', error)
    })
    return Promise.resolve()
  }
}
