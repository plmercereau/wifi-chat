import { Server } from './types'

export const compareServers = (a: Server, b: Server) => a.id === b.id
// a.hostname === b.hostname && a.port === b.port
