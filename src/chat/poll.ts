import { Status, ServerConnection } from './types'
import { store } from 'src/store'

export const startPoll = () => {
  const serversAttempts: Map<string, number> = new Map()
  return setInterval(() => {
    const status: Status = store.getters['local/status']
    const servers: ServerConnection[] = store.getters['servers/disconnected']
    if (status === 'available' && servers.length > 0) {
      console.log(
        '(poll) local server available. Browse the disconnected servers...'
      )
      for (const server of servers) {
        const nbAttempts = serversAttempts.get(server.id) || 0
        if (nbAttempts < 10) {
          console.log(`(poll) trying to connect to ${server.id} ${server.name}`)
          store
            .dispatch('servers/connect', server)
            .then(() => {
              console.log(`(poll) connected to ${server.id}`)
            })
            .catch(() => {
              console.log(`(poll) impossible to connect to ${server.id}`)
              serversAttempts.set(server.id, nbAttempts + 1)
            })
        } else {
          // * remove the server if it never had any message
          store.dispatch('servers/remove', {
            id: server.id,
            checkHistory: true
          })
        }
      }
    }
  }, 4000)
}
