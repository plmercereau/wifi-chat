import Peer from 'simple-peer'
import { Store } from 'vuex'

import { Server, Status } from './types'
import { log } from './switcher'
import { Data } from '@vue/composition-api/dist/component'

let remoteStream: MediaStream | undefined

const peers = new Map<string, ExtendedPeer>()

type ExtendedPeerOptions = Peer.Options & {
  id: string
  signal: (data: string) => void
  store: Store<{}>
}

export const removeAllTracks = (stream?: MediaStream) => {
  stream?.getTracks().forEach(track => {
    track.stop()
  })
}

export const setPeer = (id: string, peer: ExtendedPeer) => peers.set(id, peer)
export class ExtendedPeer extends Peer {
  id: string
  store: Store<{}>
  constructor(opts: ExtendedPeerOptions) {
    const { id, signal, store, ...peerOptions } = opts
    log('(peer) creating', id, peerOptions.initiator)
    super({ trickle: false, objectMode: true, ...peerOptions })
    this.id = id
    this.store = store
    setPeer(id, this)

    this.on('signal', data => {
      log('(peer) signal', data)
      signal(JSON.stringify(data))
    })

    this.on('error', error => {
      log('(peer) error', error)
    })
    this.on('close', () => {
      log('(peer) close')
      peers.delete(this.id)
      this.store.dispatch('servers/status', {
        id: this.id,
        status: 'disconnected'
      })
    })
    this.on('connect', () => {
      log('(peer) connect: ' + id)
      this.sendName()
      this.sendAvatar()
      this.sendStatus('available')
    })
    this.on('data', strData => {
      log('(peer) data received', this.id, strData)
      store.dispatch('servers/onData', { id: this.id, strData })
    })
    this.on('stream', (stream: MediaStream) => {
      console.log('(peer) add stream', stream)
      remoteStream = stream
      store.dispatch('call/ready', { id: this.id })
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.on('track', (track: MediaStreamTrack, stream: MediaStream) => {
      console.log('(peer) add track')
    })
  }
  sendData(data: Data) {
    super.send(JSON.stringify(data))
  }
  sendMessage(m: string[]) {
    this.sendData({ type: 'message', value: m })
  }
  sendName() {
    this.sendData({
      type: 'name',
      value: this.store.getters['local/name']
    })
  }
  sendAvatar() {
    this.sendData({
      type: 'avatar',
      value: this.store.getters['local/avatar']
    })
  }
  sendStatus(status: Status) {
    this.sendData({ type: 'status', value: status })
  }
  call() {
    this.sendData({ type: 'call' })
  }
  hangup() {
    this.sendData({ type: 'call', value: 'hangup' })
  }
}

export const connect = async (
  { id, hostname, port, secure }: Server,
  store: Store<{}>
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    log('(ws client) connecting to ' + id)
    const localId = store.getters['local/id']
    if (peers.get(id)) {
      log('(ws client): peer already exists.', peers.get(id))
      reject()
    }
    if (localId === id) {
      log('(ws client): cannot connect to loopback (self)')
      reject()
    }
    const ws = new WebSocket(`${secure ? 'wss' : 'ws'}://${hostname}:${port}`)
    let peer: ExtendedPeer | undefined
    ws.addEventListener('open', () => {
      log(
        '(ws client) connected. Creating peer and sending local id through the websocket'
      )
      peer = new ExtendedPeer({
        id,
        store,
        signal: (message: string) => {
          ws.send(message)
        }
      })
      peer.on('connect', () => {
        log('(ws client) peer connected. resolve.')
        resolve()
      })
      peer.on('error', error => {
        reject('(ws client) peer error. reject ' + error)
      })
      ws.send(JSON.stringify({ id: localId }))
    })

    ws.addEventListener('error', error => {
      log('(ws client) error', error)
      reject()
    })
    ws.addEventListener('close', () => {
      log('(ws client) close')
      peer?.destroy()
    })
    ws.addEventListener('message', function incoming({ data }) {
      log('(ws client) message', data.length)
      try {
        peer?.signal(data)
      } catch (error) {
        // * Peer has been probably destroyed
        console.log('(ws client) peer signal error', error)
        ws.close()
        reject()
      }
    })
  })

export const disconnectAll = () => {
  for (const [, peer] of peers) peer.destroy()
  peers.clear()
}

export const getPeer = (key: Server | string) =>
  peers.get(typeof key === 'string' ? key : key.id)

export const getAllPeers = () => peers

export const getRemoteStream = () => remoteStream
