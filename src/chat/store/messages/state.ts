import { Message } from '../../types'
import { OrderedMap } from 'immutable'

export interface MessagesStateInterface {
  messages: OrderedMap<string, OrderedMap<string, Message[]>>
}

export const initialState = (): MessagesStateInterface => ({
  messages: OrderedMap<string, OrderedMap<string, Message[]>>()
})

export default initialState()
