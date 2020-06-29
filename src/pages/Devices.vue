<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" @click="leave")
        q-toolbar-title {{ $t('settings.device.title') }}
    q-page-container
      q-page
        div.q-pa-md.row
          div.text-center(v-if="hasDevices")
            video(:srcObject.prop="stream" autoplay playsinline muted)
            q-select(v-model="cameraId"
              :options="cameras"
              :label="$t('device.video_input')"
              option-value="deviceId" emit-value map-options borderless) 
            q-linear-progress.q-mt-md(:value="audiometer" instant-feedback)
            q-select(v-model="microId"
              :options="microphones"
              :label="$t('device.audio_input')"
              option-value="deviceId" emit-value map-options borderless) 
            //- q-select(v-model="audioOutput"
            //-   :options="audioOutputDevices"
            //-   :label="$t('device.audio_output')"
            //-   option-value="deviceId" emit-value map-options borderless) 
          div(v-else) {{ $t('device.error') }}
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  onUnmounted
} from '@vue/composition-api'
import { Loading } from 'quasar'
import PAvatarImage from 'components/AvatarImage.vue'
import PSelectLanguage from 'components/SelectLanguage.vue'
import { removeAllTracks } from 'src/chat/webrtc'
import { getDevicesInfo } from 'src/chat/devices'

// TODO animation/transition the video and audio components - loading is a bit rough
export default defineComponent({
  name: 'PageChat',
  components: {
    PAvatarImage,
    PSelectLanguage
  },
  setup(_, { root: { $store, $router } }) {
    const audiometer = ref(0.0)
    const hasDevices = ref(!!navigator.mediaDevices)
    const stream = ref<MediaStream>()
    const devices = ref<MediaDeviceInfo[]>([])

    const constraints = computed<MediaStreamConstraints>(
      () => $store.getters['local/constraints']
    )

    // TODO store in vuex
    const _cameraId = ref()
    const cameraId = computed({
      get: () => _cameraId.value,
      set: async (deviceId: string) => {
        $store.commit('local/updateConstraints', { video: { deviceId } })
        stream.value = await navigator.mediaDevices.getUserMedia(
          constraints.value
        )
        _cameraId.value = deviceId
      }
    })
    const cameras = computed(() =>
      devices.value.filter(device => device.kind === 'videoinput')
    )

    // TODO store in vuex
    const _microId = ref()
    const microId = computed({
      get: () => _microId.value,
      set: async (deviceId: string) => {
        $store.commit('local/updateConstraints', { audio: { deviceId } })
        stream.value = await navigator.mediaDevices.getUserMedia(
          constraints.value
        )
        // await stream.value?.getAudioTracks()[0].applyConstraints({ deviceId })
        _microId.value = deviceId
      }
    })
    const microphones = computed(() =>
      devices.value.filter(device => device.kind === 'audioinput')
    )

    // TODO handle audio output - not in getUserMedia - and will need to play a sound
    // const audioOutput = ref('default')
    // const audioOutputDevices = computed(() =>
    //   devices.value.filter(device => device.kind === 'audiooutput')
    // )

    onMounted(async () => {
      try {
        Loading.show()
        devices.value = await getDevicesInfo()
        stream.value = await navigator.mediaDevices.getUserMedia(
          constraints.value
        )

        if ($store.getters['local/cameraId'])
          _cameraId.value = $store.getters['local/cameraId'] as string
        else if (cameras.value.length) {
          let index = cameras.value.findIndex(
            device => device.deviceId === 'default'
          )
          index = index === -1 ? 0 : index
          _cameraId.value = cameras.value[index].deviceId
        }

        if ($store.getters['local/microphoneId'])
          _microId.value = $store.getters['local/microphoneId'] as string
        else if (microphones.value.length) {
          let index = microphones.value.findIndex(
            device => device.deviceId === 'default'
          )
          index = index === -1 ? 0 : index
          _microId.value = microphones.value[index].deviceId
        }

        // TODO separate into a distinct component
        const audioContext = new window.AudioContext()
        const source = audioContext.createMediaStreamSource(stream.value)
        const analyser = audioContext.createAnalyser()
        source.connect(analyser)
        analyser.fftSize = 2048
        const sampleBuffer = new Float32Array(analyser.fftSize)
        function loop() {
          analyser.getFloatTimeDomainData(sampleBuffer)
          let peakInstantaneousPower = 0
          for (let i = 0; i < sampleBuffer.length; i++) {
            const power = sampleBuffer[i] ** 2
            peakInstantaneousPower = Math.max(power, peakInstantaneousPower)
          }
          const peakInstantaneousPowerDecibels =
            (10 + Math.log10(peakInstantaneousPower)) / 10

          audiometer.value = peakInstantaneousPowerDecibels
          requestAnimationFrame(loop)
        }
        loop()
      } catch (err) {
        console.log(err)
        hasDevices.value = false
      } finally {
        Loading.hide()
      }
    })

    onUnmounted(() => {
      console.log('unmounted')
      removeAllTracks(stream.value)
    })

    const leave = () => {
      $router.go(-1)
    }

    // TODO close video when leaving the page - except when ongoing call
    return {
      hasDevices,
      stream,
      audiometer,
      microId,
      // audioOutput,
      cameraId,
      microphones,
      // audioOutputDevices,
      cameras,
      leave
    }
  }
})
</script>
<style scoped>
video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  width: 80%;
  border-radius: 25px;
}
</style>
