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
import { useServers } from 'src/chat'
import { store } from 'src/store'
import { useLocal, useCall } from 'src/compositions'

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
    const { videoCall } = useCall()
    const onLeft = ({ reset }: { reset: Function }, id: string) => {
      reset()
      videoCall(id)
    }
    return {
      videoCall,
      onLeft,
      name,
      avatar,
      status,
      servers: useServers(store)
    }
  }
})
</script>
