import { Message } from '../../types'

export interface MessagesStateInterface {
  messages: { [id: string]: Message[] }
}

export const initialState = (): MessagesStateInterface => ({
  messages: {}
})

export default initialState()
