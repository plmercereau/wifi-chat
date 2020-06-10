import net from 'net'
import { Server } from '../types'

export const log = console.log

export const checkServer = async (
  { hostname, port }: Server,
  timeout = 1000
) => {
  const promise = new Promise((resolve, reject) => {
    const socket = new net.Socket()
    const onError = () => {
      socket.destroy()
      reject()
    }
    socket.setTimeout(timeout)
    socket.once('error', onError)
    socket.once('timeout', onError)
    socket.connect(port, hostname, () => {
      socket.end()
      resolve()
    })
  })

  try {
    await promise
    return true
  } catch (_) {
    return false
  }
}
