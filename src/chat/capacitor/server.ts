import {
  WebServer,
  Response
} from 'app/src-capacitor/node_modules/@ionic-native/web-server'
import { SERVICE_PORT, HTTP_HEADERS } from '../config'

import { log } from './utils'
import { HandlePeerRequest } from '../types'

export const stopServer = async () => {
  log('stop http server')
  await WebServer.stop()
}

export const startServer = async (handlePeerRequest: HandlePeerRequest) => {
  try {
    await stopServer()
  } finally {
    log('start http server')
    const res: Response = {
      status: 200,
      headers: HTTP_HEADERS
    }
    WebServer.onRequest().subscribe(req => {
      log('On request')
      handlePeerRequest(req.body)
        .then(answer => {
          res.body = answer
        })
        .catch(err => {
          log('bad request', JSON.stringify(err))
          res.status = 400
          res.body = 'Bad Request'
        })
        .finally(() => {
          WebServer.sendResponse(req.requestId, res)
            .then(() => log('http response ok.'))
            .catch(err => {
              log(err)
            })
        })
    })
    await WebServer.start(SERVICE_PORT)
    log(`listening to port ${SERVICE_PORT}...`)
  }
}
