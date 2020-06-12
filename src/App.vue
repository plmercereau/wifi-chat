<template lang="pug">
  div(id="q-app")
    //- transition(:name="transitionName" mode="out-in")
    router-view
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { useStart } from './chat'
import { store } from './store'

export default defineComponent({
  name: 'App',

  setup() {
    // const transitionName = ref<string>('')
    // watch(
    //   () => context.root.$route,
    //   (to, from) => {
    //     console.log('new route')
    //     if (from) {
    //       const toDepth = to.path.split('/').length
    //       const fromDepth = from.path.split('/').length
    //       console.log(toDepth, fromDepth)
    //       transitionName.value = toDepth < fromDepth ? 'page' : 'slide-left'
    //     }
    //   }
    // )
    const start = useStart(store)
    onMounted(async () => {
      await start()
    })
    return {}
  }
})
</script>

<style lang="scss" scoped>
// .page-enter-active,
// .page-leave-active {
//   transition: opacity 1s, transform 1s;
// }
// .page-enter,
// .page-leave-to {
//   opacity: 0;
//   transform: translateX(-30%);
// }
</style>
