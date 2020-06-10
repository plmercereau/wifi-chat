<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-btn(v-if="!isIndex" flat round dense icon="arrow_back" to='/')
        q-toolbar-title Quasar App
        div Quasar v{{ $q.version }}
    q-page-container
      router-view
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'MainLayout',

  setup(_, context) {
    const isIndex = computed(() => context.root.$route.path === '/')

    const transitionName = ref('slide-left')
    watch(
      () => context.root.$route,
      (to, from) => {
        console.log('new route')
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        transitionName.value =
          toDepth < fromDepth ? 'slide-right' : 'slide-left'
        console.log(transitionName.value)
      }
    )
    return { isIndex, transitionName }
  }
})
</script>
<style scoped>
.slide-left-leave-active,
.slide-left-enter-active {
  transition: 1s;
}
/* .slide-left-enter {
  transform: translate(100%, 0);
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
} */
</style>
