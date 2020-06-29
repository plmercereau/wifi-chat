import { removeAllTracks } from './webrtc'

export const getDevicesInfo = async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  const devicesInfoList = await navigator.mediaDevices.enumerateDevices()
  removeAllTracks(stream)
  const result = devicesInfoList.map(async deviceInfo => {
    const constraint = {
      [deviceInfo.kind === 'audioinput' ? 'audio' : 'video']: {
        deviceId: deviceInfo.deviceId
      }
    }
    console.log(deviceInfo.toJSON()) // TODO remove
    stream = await navigator.mediaDevices.getUserMedia(constraint)
    const res = {
      ...deviceInfo.toJSON(),
      label: stream[
        deviceInfo.kind === 'audioinput' ? 'getAudioTracks' : 'getVideoTracks'
      ]()[0].label
    } as MediaDeviceInfo
    removeAllTracks(stream)
    return res
  })
  removeAllTracks(stream)
  return await Promise.all(result)
}
