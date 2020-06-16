export interface CallStateInterface {
  ringing: boolean
  calling: boolean
  remote?: string
  stream: boolean
}

export const initialState = (): CallStateInterface => ({
  ringing: false,
  calling: false,
  stream: false,
  remote: undefined
})

export default initialState()
