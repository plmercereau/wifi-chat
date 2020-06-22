<template lang="pug">
  q-overlay(v-model="ringing" no-scroll :z-index="5000")
    template(#body)
      div(v-if="remote").fixed-center
        div.row.justify-evenly.q-pa-md
          div(v-if="receivingCall") {{remote.name}} is calling you
          div(v-else) Calling {{remote.name}}...
        div.row.justify-evenly.q-gutter-xl
          q-btn(v-if="receivingCall" color="green" icon="call" @click="pickup")
          q-btn(color="red" icon="call_end" @click="hangup")        
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from '@vue/composition-api'
import { store } from '../store'
export default defineComponent({
  name: 'CallOverlay',
  setup(_, { root: { $router } }) {
    const ringing = computed(() => store.getters['call/ringing'])
    const receivingCall = computed(() => store.getters['call/receivingCall'])
    const remoteId = computed(() => store.getters['call/remote'])
    const remote = computed(
      () => remoteId.value && store.getters['servers/get'](remoteId.value)
    )
    const pickup = async () => {
      await store.dispatch('pickup', { initiator: true })
    }
    const stop = watchEffect(() => {
      if (store.getters['call/starting']) {
        $router.push(`/call/${remoteId.value}`)
        stop()
      }
    })

    const hangup = () => {
      store.dispatch('hangup', { initiator: true })
    }
    return { ringing, receivingCall, remote, pickup, hangup }
  }
})
</script>
