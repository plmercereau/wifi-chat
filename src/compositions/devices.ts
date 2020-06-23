import { ref, Ref } from '@vue/composition-api'
import { Store } from 'vuex'

import { GlobalState } from 'src/chat/store'
import { getPeer } from 'src/chat/webrtc'
import { log } from 'src/chat/switcher'

export const useLocalDevices = (store: Store<GlobalState>, id: Ref<string>) => {
  const stream = ref<MediaStream | undefined>()
  // TODO onMounted and async/await
  if (navigator.mediaDevices)
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user' // TODO or environment
        },
        audio: true
      })
      .then(local => {
        stream.value = local
        getPeer(id.value)?.addStream(local)
      })
      .catch(error => {
        log('(call) error', error)
        store.dispatch('hangup', { initiator: true })
      })
  else
    log(
      '(call) navigator.mediaDevices is undefined! The local stream will not start'
    )

  const toggleTrack = (track: 'microphone' | 'camera') => {
    console.log('(call) toggle track')
    const peer = getPeer(id.value)
    const getter = track === 'microphone' ? 'getAudioTracks' : 'getVideoTracks'
    if (stream.value && peer) {
      const track = stream.value[getter]()[0]
      track.enabled = !track.enabled
      peer.replaceTrack(track, track, stream.value)
    }
  }

  const toggleMicro = () => toggleTrack('microphone')
  const toggleCamera = () => toggleTrack('camera')

  // TODO
  const toggleFrontRear = () => {
    navigator.mediaDevices.enumerateDevices().then(res => {
      res.forEach(device => {
        console.log(device.toJSON())
      })
    })
  }

  return { stream, toggleMicro, toggleCamera, toggleFrontRear }
}
