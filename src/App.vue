<template lang="pug">
  div(id="q-app")
    router-view
    call-overlay
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import CallOverlay from 'components/CallOverlay.vue'
import { useStart } from './chat'
import { store } from './store'

export default defineComponent({
  name: 'App',
  components: {
    CallOverlay: CallOverlay
  },
  setup() {
    const start = useStart(store)
    onMounted(async () => {
      await start()
    })
    return {}
  }
})
</script>
