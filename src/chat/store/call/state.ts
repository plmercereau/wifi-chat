export type CallOptions = { id?: string; initiator?: boolean }

export interface CallStateInterface {
  status: 'pending' | 'ringing' | 'starting' | 'ongoing'
  initiator: boolean
  remote?: string
}

export const initialState = (): CallStateInterface => ({
  status: 'pending',
  initiator: false,
  remote: undefined
})

export default initialState()
