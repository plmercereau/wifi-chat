import { ActionContext } from 'vuex'

import { LocalStateInterface } from './state'
import { Status, Server, ServerConnection } from '../../types'
import { log } from '../../switcher'

let poll: number

export const startPoll = ({
  getters,
  rootGetters,
  dispatch
}: ActionContext<LocalStateInterface, {}>) => {
  const serversAttempts: Map<string, number> = new Map()
  poll = window.setInterval(() => {
    const status: Status = getters['status']
    const servers: ServerConnection[] = rootGetters['connections/disconnected']
    if (status === 'available' && servers.length > 0) {
      console.log('(poll) local server available. Browse disconnected servers')
      for (const server of servers) {
        const nbAttempts = serversAttempts.get(server.id) || 0
        if (nbAttempts < 10) {
          console.log(`(poll) connecting to ${server.id} ${server.name}`)

          dispatch('connections/connect', server, { root: true })
            .then(() => {
              console.log(`(poll) connected to ${server.id}`)
            })
            .catch(() => {
              console.log(`(poll) impossible to connect to ${server.id}`)
              serversAttempts.set(server.id, nbAttempts + 1)
            })
        } else if (rootGetters['messages/get'](server.id)?.length > 0) {
          // * remove the server if it never had any message
          dispatch(
            'connections/remove',
            {
              id: server.id,
              checkHistory: true
            },
            { root: true }
          )
        }
      }
    }
  }, 4000)
}

export const stopPoll = () => {
  clearInterval(poll)
}

export const useAddServer = ({
  rootGetters,
  commit,
  dispatch
}: ActionContext<LocalStateInterface, {}>) => async (
  server?: Server
): Promise<void> => {
  if (server) {
    if (server.id === rootGetters['local/id']) return
    console.log('(add server) add', server)
    if (rootGetters['connections/get'](server.id))
      commit('connections/update', server, { root: true })
    else commit('connections/add', server, { root: true })
    try {
      await dispatch('connections/connect', server, { root: true })
    } catch (error) {
      log('(add server) connection failed', error)
    }
  }
}

export const useRemoveServer = ({
  commit
}: ActionContext<LocalStateInterface, {}>) => async (
  server?: Server
): Promise<void> => {
  log('(remove server) remove', JSON.stringify(server))
  if (server) commit('connections/remove', server, { root: true })
  return Promise.resolve(void 0)
}
