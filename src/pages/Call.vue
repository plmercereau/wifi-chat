<template lang="pug">
  q-layout.fit(view="lHh Lpr lFf" @mousemove="showMenu" @click="showMenu")
    q-header.transparent(@mouseover="hover = true" @mouseleave="hover = false")
      transition(appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut")
        q-toolbar.bg-primary.z-top.absolute(v-if="visibleMenu && server")
          avatar(:src="server.avatar" :status="server.status" :name="server.name")
          q-toolbar-title {{server.name}}
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
            div(v-if="visibleMenu")
              q-btn(color="red" icon="call_end" @click="hangup")  
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watchEffect,
  computed
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
        .getUserMedia({ video: true, audio: true })
        .then(local => {
          localStream.value = local
          getPeer(props.id)?.addStream(local)
        })
        .catch(error => {
          log('(call) error', error)
          store.dispatch('call/hangup', { initiator: true })
        })
    else
      log(
        'navigator.mediaDevices is undefined! The local stream will not start'
      )
    const server = useServer(props)
    const { hangup } = useCall()
    return {
      hover,
      showMenu,
      visibleMenu,
      server,
      hangup,
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
