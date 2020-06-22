<template lang="pug">
  q-layout.fit(view="lHh Lpr lFf" @mousemove="showMenu" @click="showMenu")
    q-header.transparent(@mouseover="hover = true" @mouseleave="hover = false")
      transition(appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut")
        q-toolbar.bg-primary.z-top.absolute(v-if="visibleMenu && server")
          avatar(:src="server.avatar" :status="server.status" :name="server.name")
          q-toolbar-title {{server.name}}
          div {{timer}}
    q-page-container
      q-page
        transition(appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut")
          video.window-height.q-pa-xs(v-if="remoteStream" :srcObject.prop="remoteStream" autoplay playsinline)
        transition(appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut")
          video.local.absolute-bottom-right.q-pa-md(v-if="localStream" :srcObject.prop="localStream" autoplay playsinline muted)
        div.q-pa-lg.justify-center.row.no-wrap.absolute-bottom(@mouseover="hover = true" @mouseleave="hover = false")
          transition(appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut")
            div.q-pa-md.q-gutter-sm(v-if="visibleMenu")
              q-btn(@click="hangup" icon="call_end" round color="red")
                q-tooltip Hangup
              q-btn(@click="toggleMicro" :icon="micro ? 'mic' : 'mic_off'" round)
                q-tooltip(v-if="micro") Mute
                q-tooltip(v-else) Unmute
              q-btn(@click="toggleCamera" :icon="camera ? 'videocam' : 'videocam_off'" round)
                q-tooltip(v-if="camera") Hide video
                q-tooltip(v-else) Show video
              q-btn(@click="toggleFrontRear" :icon="frontCamera ? 'camera_front' : 'camera_rear'" round)
                q-tooltip Toggle front/rear camera
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watchEffect,
  computed,
  Ref
} from '@vue/composition-api'
import { store } from 'src/store'
import AvatarComponent from 'components/Avatar.vue'
import { getPeer, getRemoteStream, removeAllTracks } from 'src/chat/webrtc'
import { Route, NavigationGuardNext } from 'vue-router'
import { useServer, useCall } from 'src/compositions'
import { log } from 'src/chat/switcher'

export default defineComponent({
  name: 'PageCall',
  components: {
    avatar: AvatarComponent
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
    if (store.getters['local/id'] && store.getters['call/remote']) next()
    else next('/')
  },
  setup(props, { root: { $router } }) {
    const hover = ref(false)
    const clicked = ref(false)
    let timeout: NodeJS.Timeout
    const showMenu = () => {
      clicked.value = true
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => (clicked.value = false), 1500)
    }
    const visibleMenu = computed(() => hover.value || clicked.value)
    const localStream = ref<MediaStream>()
    const remoteStream = ref<MediaStream>()

    const toggleTrack = (
      track: 'microphone' | 'camera',
      toggle: Ref<boolean>
    ) => {
      console.log('toggle track')
      const stream = localStream.value
      const peer = getPeer(props.id)
      const getter =
        track === 'microphone' ? 'getAudioTracks' : 'getVideoTracks'
      if (stream && peer) {
        const track = stream[getter]()[0]
        track.enabled = !track.enabled
        peer.replaceTrack(track, track, stream)
        toggle.value = !toggle.value
      }
    }
    const micro = ref(true)
    const toggleMicro = () => toggleTrack('microphone', micro)

    const camera = ref(true)
    const toggleCamera = () => toggleTrack('camera', camera)

    // TODO
    const frontCamera = ref(true)
    const toggleFrontRear = () => {
      frontCamera.value = !frontCamera.value
      navigator.mediaDevices.enumerateDevices().then(res => {
        res.forEach(device => {
          console.log(device.toJSON())
        })
      })
    }

    const stop = watchEffect(() => {
      if (store.getters['call/ongoing']) remoteStream.value = getRemoteStream()
      else if (remoteStream.value) {
        removeAllTracks(remoteStream.value)
        removeAllTracks(localStream.value)
        $router.push(`/chat/${props.id}`)
        stop()
      }
    })

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
          localStream.value = local
          getPeer(props.id)?.addStream(local)
        })
        .catch(error => {
          log('(call) error', error)
          store.dispatch('hangup', { initiator: true })
        })
    else
      log(
        'navigator.mediaDevices is undefined! The local stream will not start'
      )
    const server = useServer(props)
    const { timer, hangup } = useCall()
    return {
      hover,
      showMenu,
      visibleMenu,
      server,
      timer,
      hangup,
      micro,
      toggleMicro,
      camera,
      toggleCamera,
      frontCamera,
      toggleFrontRear,
      localStream,
      remoteStream
    }
  }
})
</script>
<style scoped>
video {
  width: 100%;
  height: auto;
  max-height: 100%;
}
video.local {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  width: 30%;
  border-radius: 25px;
}
</style>
