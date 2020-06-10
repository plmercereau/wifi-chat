<template lang="pug">
  q-page
    div.col-12(v-if="starting") Starting...
    q-input.col-6(v-model="name" label="name" required)
    q-btn.col-6(v-if="started" @click="changeName" :disabled="!name") Change name
    q-btn.col-6(v-else @click="start" :disabled="!name") Start
    q-list.col-12(bordered separator)
      q-item(v-for="{id, name, status, hostname, secure, port} in servers"
        :to="'/chat/' + id"
        :key="id"
        clickable
        v-ripple)
        q-item-section
          q-item-label {{name}} - {{status}}
          q-item-label(caption) {{secure ? 'https' : 'http'}}://{{hostname}}:{{port}}
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useStart, EventBus, useServers } from 'src/chat'
import { store } from 'src/store'

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const started = ref(false)
    const starting = ref(false)
    const name = ref(store.getters['local/name'])
    // TODO forget about this mess: set the server status into the store!
    EventBus.$on('starting', () => {
      starting.value = true
    })
    EventBus.$on('started', () => {
      starting.value = false
      started.value = true
    })
    const startServer = useStart(store)
    const start = () => {
      if (name.value) {
        store.dispatch('local/name', name.value)
        startServer()
      }
    }
    const changeName = () => {
      store.dispatch('local/name', name.value)
    }
    return {
      starting,
      started,
      start,
      changeName,
      servers: useServers(store),
      name
    }
  }
})
</script>
