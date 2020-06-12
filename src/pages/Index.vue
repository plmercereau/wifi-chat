<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-toolbar-title Patient chat
        avatar.absolute-center(:src="avatar" :status="status" :name="name")
        q-btn(round unelevated icon="more_vert")
          q-menu(auto-close)
            q-list
              q-item(clickable to="/settings")
                q-item-section Settings
    q-page-container
      q-page.q-pa-md
        q-list.col-12(bordered separator)
          q-item(v-for="{id, name, status, hostname, secure, port, avatar} in servers"
            :to="'/chat/' + id"
            :key="id"
            clickable
            v-ripple)
            q-item-section(avatar)
              avatar(:src="avatar" :status="status" :name="name")
            q-item-section
              q-item-label {{name}}
              //- q-item-label(caption) {{secure ? 'https' : 'http'}}://{{hostname}}:{{port}}
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import AvatarComponent from 'components/Avatar.vue'
import { useStart, useServers } from 'src/chat'
import { store } from 'src/store'

export default defineComponent({
  name: 'PageIndex',
  components: {
    avatar: AvatarComponent
  },
  beforeRouteEnter: (to, from, next) => {
    if (store.getters['local/name']) next()
    else next('/start')
  },
  setup() {
    const name = computed(() => store.getters['local/name'])
    const avatar = computed(() => store.getters['local/avatar'])
    const status = computed(() => store.getters['local/status'])
    const startServer = useStart(store)
    const start = () => {
      if (name.value) {
        store.dispatch('local/name', name.value)
        startServer()
      }
    }
    return {
      start,
      name,
      avatar,
      status,
      servers: useServers(store)
    }
  }
})
</script>
