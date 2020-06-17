<template lang="pug">
  div(id="q-app")
    transition(appear
      :enter-active-class="'animated '+transitionName")
      //- leave-active-class="animated faceInRight")
      router-view
    call-overlay
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from '@vue/composition-api'
import CallOverlay from 'components/CallOverlay.vue'
import { useStart } from './chat'
import { store } from './store'

export default defineComponent({
  name: 'App',
  components: {
    CallOverlay: CallOverlay
  },
  setup(_, context) {
    const start = useStart(store)
    const transitionName = ref('fadeInLeft')
    watch(
      // TODO create a navigation vuex module
      () => context.root.$route,
      (to, from) => {
        if (from) {
          const toDepth = to.path.split('/').length
          const fromDepth = from.path.split('/').length
          transitionName.value =
            to.path === '/' || toDepth < fromDepth
              ? 'fadeInLeft'
              : 'fadeInRight'
        }
      }
    )
    onMounted(async () => {
      await start()
    })
    return { transitionName }
  }
})
</script>
