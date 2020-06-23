<template lang="pug">
  q-layout.fit(view="lHh Lpr lFf" @mousemove="showMenu" @click="showMenu")
    q-header.transparent(@mouseover="hover = true" @mouseleave="hover = false")
      transition(appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut")
        q-toolbar.bg-primary.z-top.absolute(v-if="visibleMenu && server")
          p-avatar(:src="server.avatar" :status="server.status" :name="server.name")
          q-toolbar-title {{server.name}}
          p-timer(:start="startedAt")
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
                q-tooltip {{ $t('hangup') }}
              p-toggle-button(@toggle="toggleMicro"
                iconTrue="mic" iconFalse="mic_off" :tooltipTrue="$t('mute')" :tooltipFalse="$t('unmute')")
              p-toggle-button(@toggle="toggleCamera"
                iconTrue="videocam" iconFalse="videocam_off" :tooltipTrue="$t('camera_off')" tooltipFalse="$t('camera_on')")
              p-toggle-button(@toggle="toggleFrontRear"
                iconTrue="camera_front" iconFalse="camera_rear" :tooltipTrue="$t('rear_camera')" :tooltipFalse="$t('front_camera')")
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  watchEffect,
  computed,
  toRefs
} from '@vue/composition-api'
import { store } from 'src/store'
import PAvatar from 'components/Avatar.vue'
import PTimer from 'components/Timer.vue'
import PToggleButton from 'components/ToggleButton.vue'
import { getRemoteStream, removeAllTracks } from 'src/chat/webrtc'
import { Route, NavigationGuardNext } from 'vue-router'
import { useServer, useCall, useLocalDevices } from 'src/compositions'

export default defineComponent({
  name: 'PageCall',
  components: {
    PAvatar,
    PTimer,
    PToggleButton
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
    const { id } = toRefs(props)
    const hover = ref(false)
    const clicked = ref(false)
    let timeout: NodeJS.Timeout
    const showMenu = () => {
      clicked.value = true
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => (clicked.value = false), 1500)
    }
    const visibleMenu = computed(() => hover.value || clicked.value)

    const {
      stream: localStream,
      toggleMicro,
      toggleCamera,
      toggleFrontRear
    } = useLocalDevices(id)

    const remoteStream = ref<MediaStream>()

    const stop = watchEffect(() => {
      if (store.getters['call/ongoing']) remoteStream.value = getRemoteStream()
      else if (remoteStream.value) {
        removeAllTracks(remoteStream.value)
        removeAllTracks(localStream.value)
        $router.push(`/chat/${id.value}`)
        stop()
      }
    })

    const server = useServer(id)
    const { startedAt, hangup } = useCall()
    return {
      hover,
      showMenu,
      visibleMenu,
      server,
      startedAt,
      hangup,
      toggleMicro,
      toggleCamera,
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
