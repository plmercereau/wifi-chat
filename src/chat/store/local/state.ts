import { v4 as uuidv4 } from 'uuid'

export interface LocalStateInterface {
  id: string
  name: string
  avatar: string
}

const avatars = [
  'data:image/jpeg;base64,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',
  'data:image/jpeg;base64,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'
]
const randomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)]

export const initialState = (): LocalStateInterface => ({
  id: uuidv4(), // TODO persist
  name: '',
  avatar: randomAvatar()
})

export default initialState()
