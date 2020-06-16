<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar(v-if="server")
        q-btn(flat round icon="arrow_back" to='/')
        avatar(:src="server.avatar" :status="server.status" :name="server.name")
        q-toolbar-title {{server.name}}
    q-page-container
      q-page.q-pa-md.justify-center
        div(v-if="remoteStream")
        video(:srcObject.prop="remoteStream" autoplay)
        div(v-if="localStream") local
        video.local(:srcObject.prop="localStream" autoplay mute)
        q-footer.q-pa-xs.justify-center.row.no-wrap
          q-btn(color="red" icon="call_end" @click="hangup")  
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from '@vue/composition-api'
import { store } from 'src/store'
import AvatarComponent from 'components/Avatar.vue'
import { getPeer, getRemoteStream, removeAllTracks } from 'src/chat/webrtc'
import { Route, NavigationGuardNext } from 'vue-router'

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
    if (store.getters['local/id'] && store.getters['call/ongoing']) next()
    else next('/')
  },
  setup(props, { root: { $router } }) {
    const localStream = ref<MediaStream>()
    const remoteStream = ref<MediaStream>()
    watch(
      () => store.getters['call/stream'],
      (stream: boolean) => {
        if (stream) remoteStream.value = getRemoteStream()
        else if (remoteStream.value) {
          removeAllTracks(remoteStream.value)
          removeAllTracks(localStream.value)
          $router.push(`/chat/${props.id}`)
        }
      }
    )
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(local => {
        localStream.value = local
        const peer = getPeer(props.id)
        peer?.addStream(local)
      })
    const hangup = () => {
      store.dispatch('call/hangup', true)
    }
    const server = computed(() => store.getters['servers/get'](props.id))
    return {
      server,
      hangup,
      localStream,
      remoteStream
    }
  }
})
</script>
<style scoped>
video.local {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
