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
            q-select(v-model="videoInput"
              :options="videoInputDevices"
              :label="$t('device.video_input')"
              option-value="deviceId" emit-value map-options borderless) 
            q-linear-progress.q-mt-md(:value="audiometer" instant-feedback)
            q-select(v-model="audioInput"
              :options="audioInputDevices"
              :label="$t('device.audio_input')"
              option-value="deviceId" emit-value map-options borderless) 
            q-select(v-model="audioOutput"
              :options="audioOutputDevices"
              :label="$t('device.audio_output')"
              option-value="deviceId" emit-value map-options borderless) 
          div(v-else) Cannot access to your audio and video devices. The application won't likely work correctly.
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  onUnmounted
} from '@vue/composition-api'
import PAvatarImage from 'components/AvatarImage.vue'
import PSelectLanguage from 'components/SelectLanguage.vue'
import { removeAllTracks } from 'src/chat/webrtc'
import { enumerateDevices } from 'src/chat/switcher'

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

    // TODO store in vuex
    const _videoInput = ref('default')
    const videoInput = computed({
      get: () => _videoInput.value,
      set: async (deviceId: string) => {
        await stream.value?.getVideoTracks()[0].applyConstraints({ deviceId })
        _videoInput.value = deviceId
      }
    })
    const videoInputDevices = computed(() =>
      devices.value.filter(device => device.kind === 'videoinput')
    )

    // TODO store in vuex
    const _audioInput = ref('default')
    const audioInput = computed({
      get: () => _audioInput.value,
      set: async (deviceId: string) => {
        await stream.value?.getAudioTracks()[0].applyConstraints({ deviceId })
        _audioInput.value = deviceId
      }
    })
    const audioInputDevices = computed(() =>
      devices.value.filter(device => device.kind === 'audioinput')
    )

    // TODO handle audio output - not in getUserMedia - and will need to play a sound
    const audioOutput = ref('default')
    const audioOutputDevices = computed(() =>
      devices.value.filter(device => device.kind === 'audiooutput')
    )

    onMounted(async () => {
      try {
        stream.value = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        })
        devices.value = await enumerateDevices()
        if (videoInputDevices.value.length) {
          let index = videoInputDevices.value.findIndex(
            device => device.deviceId === 'default'
          )
          index = index === -1 ? 0 : index
          videoInput.value = videoInputDevices.value[index].deviceId
        }

        if (audioInputDevices.value.length) {
          let index = audioInputDevices.value.findIndex(
            device => device.deviceId === 'default'
          )
          index = index === -1 ? 0 : index
          audioInput.value = audioInputDevices.value[index].deviceId
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
      }
    })

    onUnmounted(() => {
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
      audioInput,
      audioOutput,
      videoInput,
      audioInputDevices,
      audioOutputDevices,
      videoInputDevices,
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
