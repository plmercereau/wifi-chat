import { Status } from 'src/chat/types'
import { uid } from 'quasar'
export interface LocalStateInterface {
  id: string
  name?: string
  avatar?: string
  status: Status
}

export const initialState = (): LocalStateInterface => ({
  id: uid(),
  name: undefined,
  avatar: undefined,
  status: 'disconnected'
})

export default initialState()
