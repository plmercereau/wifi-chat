export interface Server {
  id: string
  port: number
  hostname: string
  secure: boolean
}

export type Message = {
  sent: boolean
  sentAt?: number
  receivedAt?: number
  message: string[]
}
export type Status =
  | 'available'
  | 'busy'
  | 'disconnected'
  | 'offline'
  | 'online'

export type ServerConnection = Server & {
  name?: string
  avatar?: string
  status: Status
}

export type NameData = {
  type: 'name'
  value: string
}

export type MessageData = {
  type: 'message'
  value: string[]
}

export type AvatarData = {
  type: 'avatar'
  value: string
}

export type StatusData = {
  type: 'status'
  value: Status
}

export type Data = NameData | MessageData | AvatarData | StatusData

export type WatchEvent = (server?: Server) => Promise<void>

export type HandlePeerRequest = (body: string) => Promise<string>

export interface Module {
  checkServer: (
    { hostname, port }: Server,
    timeout?: number
  ) => Promise<boolean>
  defaultName: () => Promise<string>
  startServer: () => Promise<void>
  stopServer: () => Promise<void>
  publish: (name: string) => Promise<void>
  unpublish: () => Promise<void>
  watch: (onUp: WatchEvent, onDown: WatchEvent) => void
  unwatch: () => Promise<void>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (...message: any) => void
}

export interface TxtTypes {
  id: string
  app: string
}
