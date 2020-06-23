// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from 'webrtc-adapter'
import { Store } from 'vuex'
import Peer from 'simple-peer'

import { getStore } from './index'
import { Server, Status, Data } from './types'
import { log } from './switcher'
import { GlobalState } from './store'

let remoteStream: MediaStream | undefined

const peers = new Map<string, ExtendedPeer>()

type ExtendedPeerOptions = Peer.Options & {
  id: string
  signal: (data: string) => void
}

export const removeAllTracks = (stream?: MediaStream) => {
  stream?.getTracks().forEach(track => {
    track.stop()
  })
}

export const setPeer = (id: string, peer: ExtendedPeer) => peers.set(id, peer)
export class ExtendedPeer extends Peer {
  id: string
  store: Store<GlobalState>
  constructor(opts: ExtendedPeerOptions) {
    const { id, signal, ...peerOptions } = opts
    log('(peer) creating', id, !!peerOptions.initiator)
    super({ trickle: false, objectMode: true, ...peerOptions })
    this.id = id
    this.store = getStore()
    setPeer(id, this)

    this.on('signal', data => {
      log('(peer) signal', data)
      signal(JSON.stringify(data))
    })

    this.on('error', error => {
      log('(peer) error', error)
    })
    this.on('close', () => {
      log('(peer) close', this.id)
      peers.delete(this.id)
      this.store.dispatch('connections/disconnect', this.id)
    })
    this.on('connect', () => {
      log('(peer) connect', this.id)
      this.sendName()
      this.sendAvatar()
      this.sendStatus('available')
    })
    this.on('data', strData => {
      log('(peer) data received', this.id)
      this.store.dispatch('connections/on', { id: this.id, strData })
    })
    this.on('stream', (stream: MediaStream) => {
      console.log('(peer) add stream', this.id)
      remoteStream = stream
      this.store.dispatch('call/ready')
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.on('track', (track: MediaStreamTrack, stream: MediaStream) => {
      console.log('(peer) add track', this.id)
    })
  }
  private sendData(data: Data) {
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
  private callAction(value: string) {
    this.sendData({ type: 'call', value })
  }
  ring() {
    this.callAction('ring')
  }
  pickup() {
    this.callAction('pickup')
  }
  hangup() {
    this.callAction('hangup')
  }
}

export const disconnectAll = () => {
  for (const [, peer] of peers) peer.destroy()
  peers.clear()
}

export const getPeer = (key: Server | string) =>
  peers.get(typeof key === 'string' ? key : key.id)

export const getAllPeers = () => peers

export const getRemoteStream = () => remoteStream
