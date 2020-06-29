import { GetterTree } from 'vuex'
import { LocalStateInterface } from './state'

const getters: GetterTree<LocalStateInterface, unknown> = {
  id: state => state.id,
  name: state => state.name,
  avatar: state => state.avatar,
  status: state => state.status,
  locale: state => state.locale,
  constraints: state => state.constraints,
  cameraId: state => {
    if (
      state.constraints &&
      state.constraints.video &&
      typeof state.constraints.video === 'object'
    )
      return state.constraints.video.deviceId
  },
  microphoneId: state => {
    if (
      state.constraints &&
      state.constraints.audio &&
      typeof state.constraints.audio === 'object'
    )
      return state.constraints.audio.deviceId
  }
}

export default getters
