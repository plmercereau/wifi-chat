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
  message: string
}

export type ServerConnection = Server & {
  name?: string
  avatar?: string
  status: 'available' | 'busy' | 'disconnected' | 'offline'
}

export type WatchEvent = (server?: Server) => Promise<void>

export type HandlePeerRequest = (body: string) => Promise<string>

export interface Module {
  checkServer: (
    { hostname, port }: Server,
    timeout?: number
  ) => Promise<boolean>
  defaultName: () => Promise<string>
  startServer: (handlePeerRequest: HandlePeerRequest) => Promise<void>
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
