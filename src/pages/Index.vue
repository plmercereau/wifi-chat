<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header(elevated)
      q-toolbar
        q-toolbar-title {{ $t('title') }}
        p-avatar(:src="avatar" :status="status" :name="name")
        q-toolbar-title {{name}}
        q-btn(round unelevated icon="more_vert")
          q-menu(auto-close)
            q-list
              q-item(clickable to="/settings")
                q-item-section {{ $t('settings') }}
    q-page-container
      q-page.q-pa-md
        q-list.col-12(v-if="servers.length > 0" bordered separator)
          q-slide-item(v-for="{id, name, status, hostname, secure, port, avatar} in servers" :key="id"
            @left="opt => onLeft(opt, id)")
            template(v-if="status==='available'" #left)
              q-icon(name="videocam")
            q-item(:to="'/chat/' + id" clickable v-ripple)
              q-item-section(avatar)
                p-avatar(:src="avatar" :status="status" :name="name")
              q-item-section
                q-item-label {{name}}
        div(v-else) {{ $t('empty_list') }}
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Route, NavigationGuardNext } from 'vue-router'
import AvatarComponent from 'components/Avatar.vue'
import { store } from 'src/store'
import { useLocal, useCall, useServers } from 'src/compositions'

export default defineComponent({
  name: 'PageIndex',

  components: {
    PAvatar: AvatarComponent
  },

  beforeRouteEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
    if (store.getters['local/name']) next()
    else next('/start')
  },

  setup(_, { root: { $store } }) {
    const { name, avatar, status } = useLocal($store)
    const { videoCall } = useCall($store)

    const onLeft = async ({ reset }: { reset: () => void }, id: string) => {
      reset()
      await videoCall(id)
    }

    return {
      videoCall,
      onLeft,
      name,
      avatar,
      status,
      servers: useServers($store)
    }
  }
})
</script>
