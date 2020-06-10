export const APP_NAME = 'patientchat'
export const SERVICE_NAME =
  APP_NAME +
  '-' +
  Math.random()
    .toString(36)
    .substring(7)
export const SERVICE_PORT = 4000 + Math.trunc(Math.random() * 1000)
export const SERVICE_TYPE = 'http'

export const HTTP_HEADERS = {
  'Content-Type': 'text/html',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': '2592000' // 30 days
}
