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
import { store } from './store'

export default defineComponent({
  name: 'App',
  components: {
    CallOverlay: CallOverlay
  },
  setup(_, context) {
    const transitionName = ref('fadeInLeft')
    watch(
      // TODO create a navigation vuex module
      // TODO not sure it triggers at the right time
      () => context.root.$route,
      (to, from) => {
        if (from) {
          const toDepth = to.path === '/' ? 1 : to.path.split('/').length
          const fromDepth = from.path === '/' ? 1 : from.path.split('/').length
          transitionName.value =
            toDepth < fromDepth ? 'fadeInLeft' : 'fadeInRight'
        }
      }
    )
    onMounted(async () => {
      await store.dispatch('local/start')
    })
    return { transitionName }
  }
})
</script>
