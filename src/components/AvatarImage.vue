<template lang="pug">
  q-img(v-if="src" :src="src" :ratio="1")
  div(v-else) {{initials}}
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'AvatarImage',
  props: {
    src: String,
    name: String
  },
  setup(props) {
    const initials = computed(() => props.name?.charAt(0).toUpperCase())
    return { initials }
  }
})
</script>
