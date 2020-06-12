import Peer from 'simple-peer'
import axios from 'axios'
import { Store } from 'vuex'

import {
  Server,
  HandlePeerRequest,
  Status,
  MessageData,
  NameData,
  AvatarData,
  StatusData
} from './types'
import { log } from './switcher'
import { Data } from '@vue/composition-api/dist/component'

const peers = new Map<string, ExtendedPeer>()

type ExtendedPeerOptions = Peer.Options & {
  id: string
  store: Store<{}>
}

class ExtendedPeer extends Peer {
  id: string
  store: Store<{}>
  constructor(opts: ExtendedPeerOptions) {
    const { id, store, ...peerOptions } = opts
    super({ trickle: false, objectMode: true, ...peerOptions })
    this.id = id
    this.store = store
    this.on('error', () => {
      // TODO commit something
      log('peer error')
    })
    this.on('connect', () => {
      log('peer connect: ' + id)
      this.sendName()
      this.sendAvatar()
      this.sendStatus('available')
    })
    this.on('data', strData => {
      log('data received')
      store.dispatch('servers/onData', { id, strData })
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
    const peer = new ExtendedPeer({ id, store, initiator: true })
    peers.set(id, peer) // TODO revoir
    peer.on('signal', data => {
      log('(local) signal', data)
      axios
        .post(
          `${secure ? 'https' : 'http'}://${hostname}:${port}`,
          JSON.stringify({ id: store.getters['local/id'], signal: data })
        )
        .then(({ status, data }) => {
          if (status === 200) {
            peer.signal(data)
          } else {
            reject(status)
          }
        })
        .catch(err => reject(err))
    })
    peer.on('connect', () => {
      resolve()
    })
  })
}

export const useHandlePeerRequest = (
  store: Store<{}>
): HandlePeerRequest => body =>
  new Promise<string>((resolve, reject) => {
    const { id, signal } = JSON.parse(body)
    const peer = new ExtendedPeer({ id, store })
    peers.set(id, peer) // TODO revoir
    peer.on('error', () => {
      reject()
    })
    peer.on('signal', data => {
      resolve(JSON.stringify(data))
    })
    peer.signal(JSON.stringify(signal))
  })

export const disconnectAll = () => {
  for (const [, peer] of peers) peer.destroy()
  peers.clear()
}

export const getPeer = (server: Server) => peers.get(server.id)
export const getAllPeers = () => peers
