<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(flat round icon="arrow_back" to='/settings')
        q-toolbar-title {{ $t('settings.device.title') }}
    q-page-container
      q-page
        div.q-pa-md.row
          div.text-center(v-if="hasDevices && stream") Audio and video settings
            video(:srcObject.prop="stream" autoplay playsinline mute)
            q-linear-progress.q-mt-md(:value="audiometer" instant-feedback)
          div(v-else) Cannot access to your audio and video devices. The application won't likely work correctly.
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import PAvatarImage from 'components/AvatarImage.vue'
import PSelectLanguage from 'components/SelectLanguage.vue'

export default defineComponent({
  name: 'PageChat',
  components: {
    PAvatarImage,
    PSelectLanguage
  },
  setup(_, { root: { $store } }) {
    const audiometer = ref(0.0)
    const hasDevices = ref(!!navigator.mediaDevices)
    const stream = ref<MediaStream>()
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(s => {
        stream.value = s
        const audioContext = new window.AudioContext()
        const source = audioContext.createMediaStreamSource(s)
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
      })
      .catch(err => {
        console.log(err)
        hasDevices.value = false
      })
    // TODO close video when leaving the page - except when ongoing call
    return { hasDevices, stream, audiometer }
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
