export type CallOptions = { id?: string; initiator?: boolean }

export interface CallStateInterface {
  status: 'pending' | 'ringing' | 'starting' | 'ongoing'
  initiator: boolean
  remote?: string
  startedAt?: number
  endedAt?: number
}

export const initialState = (): CallStateInterface => ({
  status: 'pending',
  initiator: false,
  remote: undefined,
  startedAt: undefined,
  endedAt: undefined
})

export default initialState()
