export interface CallStateInterface {
  ringing: boolean
  ongoing: boolean
  calling: boolean
  remote?: string
  stream: boolean
}

export const initialState = (): CallStateInterface => ({
  ringing: false,
  ongoing: false,
  calling: false,
  stream: false,
  remote: undefined
})

export default initialState()
