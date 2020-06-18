import { ServerConnection } from '../../types'

export interface ServersStateInterface {
  servers: { [id: string]: ServerConnection }
}

export const initialState = (): ServersStateInterface => ({
  servers: {}
})

export default initialState()
