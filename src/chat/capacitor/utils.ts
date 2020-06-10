import { Server } from '../types'

export const log = console.log

export const checkServer = async ({ hostname, port }: Server) => {
  // ? timeout?
  console.log('check server')
  const socket = new Socket()
  socket.onError = () => void 0
  socket.onClose = () => void 0

  return new Promise<boolean>(resolve => {
    socket.open(
      hostname,
      port,
      () => {
        socket.close()
        resolve(true)
      },
      () => resolve(false)
    )
  })
}
