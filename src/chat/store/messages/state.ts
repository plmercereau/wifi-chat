import { Message } from '../../types'
import { Map } from 'immutable'

export interface MessagesStateInterface {
  messages: Map<string, Message[]>
}

export const initialState = (): MessagesStateInterface => ({
  messages: Map<string, Message[]>()
})

export default initialState()
