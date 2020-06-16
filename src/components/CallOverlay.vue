<template lang="pug">
  q-overlay(v-model="ringing" no-scroll :z-index="5000")
    template(#body)
      div.fixed-center
        div.row.justify-evenly.q-pa-md
          div(v-if="caller") {{caller.name}} is calling you
        div.justify-evenly.items-center.q-gutter-xl
          q-btn(color="green" icon="call" @click="pickup")
          q-btn(color="red" icon="call_end" @click="hangup")        
</template>

<script lang="ts">
import { defineComponent, computed, watch } from '@vue/composition-api'
import { store } from '../store'
export default defineComponent({
  name: 'CallOverlay',
  setup(_, { root: { $router } }) {
    const ringing = computed(() => store.getters['call/ringing'])
    const caller = computed(() =>
      store.getters['servers/get'](store.getters['call/remote'])
    )
    const pickup = async () => {
      await store.dispatch('call/pickup')
    }
    watch(
      () => store.getters['call/ongoing'],
      ongoing => {
        if (ongoing) $router.push(`/call/${store.getters['call/remote']}`)
      }
    )

    const hangup = () => {
      store.dispatch('call/hangup', true)
    }
    return { ringing, caller, pickup, hangup }
  }
})
</script>
