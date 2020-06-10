import http from 'http'

import { SERVICE_PORT, HTTP_HEADERS } from '../config'

import { log } from './utils'
import { HandlePeerRequest } from '../types'

let server: http.Server

export const stopServer = () => {
  log('stop http server')
  server?.close()
  return Promise.resolve()
}

export const startServer = async (handlePeerRequest: HandlePeerRequest) => {
  try {
    await stopServer()
  } finally {
    log('start http server')
    server = http.createServer(function(req, res) {
      if (req.method === 'POST') {
        let body = ''
        req.on('data', chunk => {
          body += chunk.toString() // convert Buffer to string
        })
        req.on('end', () => {
          handlePeerRequest(body)
            .then(answer => {
              res.writeHead(200, HTTP_HEADERS)
              res.end(answer)
            })
            .catch(err => {
              log(err)
              res.writeHead(500, HTTP_HEADERS)
              res.end('Internal error')
            })
        })
      } else {
        res.writeHead(400, HTTP_HEADERS)
        res.end('Bad Request')
      }
    })
    return new Promise<void>((resolve, reject) => {
      server.listen(SERVICE_PORT, undefined, (err: unknown) => {
        if (err) {
          log(err)
          reject()
        } else {
          log(`listening to port ${SERVICE_PORT}...`)
          resolve()
        }
      })
    })
  }
}
