<template lang="pug">
  q-overlay(v-model="receivingCall" no-scroll :z-index="5000")
    template(#body)
      div.fixed-center
        div.row.justify-evenly.q-pa-md
          div(v-if="caller") {{caller.name}} is calling you
        div.justify-evenly.items-center.q-gutter-xl
          q-btn(color="green" icon="call" @click="pickup")
          q-btn(color="red" icon="call_end" @click="hangup")        
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from '@vue/composition-api'
import { store } from '../store'
export default defineComponent({
  name: 'CallOverlay',
  setup(_, { root: { $router } }) {
    const receivingCall = computed(() => store.getters['call/receivingCall'])
    const remoteId = computed(() => store.getters['call/remote'])
    const caller = computed(
      () => remoteId.value && store.getters['servers/get'](remoteId.value)
    )
    const pickup = async () => {
      await store.dispatch('call/pickup', { initiator: true })
    }
    const stop = watchEffect(() => {
      if (store.getters['call/starting']) {
        $router.push(`/call/${remoteId.value}`)
        stop()
      }
    })

    const hangup = () => {
      store.dispatch('call/hangup', { initiator: true })
    }
    return { receivingCall, caller, pickup, hangup }
  }
})
</script>
