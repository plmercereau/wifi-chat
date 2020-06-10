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
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'MainLayout',

  setup(_, { root }) {
    const isIndex = computed(() => root.$route.path === '/')
    return { isIndex }
  }
})
</script>
