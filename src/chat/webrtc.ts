import Peer from 'simple-peer'
import { Store } from 'vuex'

import {
  Server,
  Status,
  MessageData,
  NameData,
  AvatarData,
  StatusData
} from './types'
import { log } from './switcher'
import { Data } from '@vue/composition-api/dist/component'
import WebSocket from 'isomorphic-ws'

const peers = new Map<string, ExtendedPeer>()

type ExtendedPeerOptions = Peer.Options & {
  id: string
  ws?: WebSocket
  store: Store<{}>
}

export const setPeer = (id: string, peer: ExtendedPeer) => peers.set(id, peer)
export class ExtendedPeer extends Peer {
  id: string
  ws: WebSocket | undefined
  store: Store<{}>
  constructor(opts: ExtendedPeerOptions) {
    const { id, ws, store, ...peerOptions } = opts
    const stream = new MediaStream()
    super({ trickle: false, objectMode: true, stream, ...peerOptions })
    this.id = id
    this.ws = ws
    this.store = store
    setPeer(id, this)
    if (ws) {
      ws.addEventListener('error', error => {
        console.log('ws client error', error)
      })
      if (peerOptions.initiator) {
        ws.addEventListener('open', () => {
          console.log('ws client: on open')
          ws.send(JSON.stringify({ id: this.id }))
        })
      }
    }
    this.on('signal', data => {
      console.log('ws peer signal', data)
      this.ws?.send(JSON.stringify(data))
    })

    this.on('error', error => {
      // TODO commit something
      log('peer error', error)
    })
    this.on('close', () => {
      // TODO commit something
      log('peer close')
    })
    this.on('connect', () => {
      log('peer connect: ' + id)
      this.sendName()
      this.sendAvatar()
      this.sendStatus('available')
    })
    this.on('data', strData => {
      log('data received', this.id, strData)
      store.dispatch('servers/onData', { id: this.id, strData })
    })
    this.on('stream', (stream: MediaStream) => {
      console.log('on add stream', stream)
      store.dispatch('call/ring')
    })
    this.on('track', (track: any, stream: MediaStream) => {
      console.log('on add track')
    })
  }
  sendData(data: Data) {
    this.send(JSON.stringify(data))
  }
  sendMessage(m: string[]) {
    const data: MessageData = { type: 'message', value: m }
    this.sendData(data)
  }
  sendName() {
    const data: NameData = {
      type: 'name',
      value: this.store.getters['local/name']
    }
    this.sendData(data)
  }
  sendAvatar() {
    const data: AvatarData = {
      type: 'avatar',
      value: this.store.getters['local/avatar']
    }
    this.sendData(data)
  }
  sendStatus(status: Status) {
    const data: StatusData = { type: 'status', value: status }
    this.sendData(data)
  }
}

export const connect = async (
  { id, hostname, port, secure }: Server,
  store: Store<{}>
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    log('connecting')
    const ws = new WebSocket(`${secure ? 'wss' : 'ws'}://${hostname}:${port}`)
    const peer = new ExtendedPeer({ id, ws, store, initiator: true })
    ws.addEventListener('message', function incoming({ data }) {
      console.log('ws client: on open', data)
      peer.signal(data)
    })
    ws.addEventListener('error', error => {
      console.log('ws client error', error)
      reject()
    })
    peer.on('connect', () => {
      resolve()
    })
    peer.on('error', error => {
      reject(error)
    })
  })
}

export const disconnectAll = () => {
  for (const [, peer] of peers) peer.destroy()
  peers.clear()
}

export const getPeer = (key: Server | string) =>
  peers.get(typeof key === 'string' ? key : key.id)

export const getAllPeers = () => peers
