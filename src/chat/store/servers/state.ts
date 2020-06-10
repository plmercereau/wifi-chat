import { Map } from 'immutable'
import { ServerConnection } from '../../types'

export interface ServersStateInterface {
  servers: Map<string, ServerConnection>
}

export const initialState = (): ServersStateInterface => ({
  servers: Map()
})

export default initialState()
