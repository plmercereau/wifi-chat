<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-toolbar-title Wifi Video Chat
        p-avatar(:src="avatar" :status="status" :name="name")
        q-toolbar-title {{name}}
        q-btn(round unelevated icon="more_vert")
          q-menu(auto-close)
            q-list
              q-item(clickable to="/settings")
                q-item-section Settings
    q-page-container
      q-page.q-pa-md
        q-list.col-12(v-if="servers.length > 0" bordered separator)
          q-item(v-for="{id, name, status, hostname, secure, port, avatar} in servers"
            :to="'/chat/' + id"
            :key="id"
            clickable
            v-ripple)
            q-item-section(avatar)
              p-avatar(:src="avatar" :status="status" :name="name")
            q-item-section
              q-item-label {{name}}
              //- q-item-label(caption) {{secure ? 'https' : 'http'}}://{{hostname}}:{{port}}
        div(v-else) No one else seems to be connected for now. Watching new peers...
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Route, NavigationGuardNext } from 'vue-router'
import AvatarComponent from 'components/Avatar.vue'
import { useStart, useServers } from 'src/chat'
import { store } from 'src/store'
import { useLocal } from 'src/compositions'

export default defineComponent({
  name: 'PageIndex',
  components: {
    PAvatar: AvatarComponent
  },
  beforeRouteEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
    if (store.getters['local/name']) next()
    else next('/start')
  },
  setup() {
    const { name, avatar, status } = useLocal()
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
